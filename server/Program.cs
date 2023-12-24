using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.EntityFrameworkCore;
using Minio;
using RabbitMQ.Client;
using Transcribey.Data;
using Transcribey.Models;
using Transcribey.Utils;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("TranscribeyContext") ??
                         throw new InvalidOperationException(
                             "Connection string 'TranscribeyContext' not found.")));

builder.Services.AddMinio(client => client
    .WithEndpoint(builder.Configuration.GetValue<string>("MinIO:Endpoint"))
    .WithSSL(builder.Configuration.GetValue<bool>("MinIO:UseSSL"))
    .WithCredentials(
        builder.Configuration.GetValue<string>("MinIO:AccessKey"),
        builder.Configuration.GetValue<string>("MinIO:SecretKey")));
builder.Services.AddScoped<IObjectStorage, ObjectStorage>();

builder.Services.AddSingleton<IConnection>(_ =>
{
    var connectionFactory = new ConnectionFactory
    {
        Uri = new Uri(builder.Configuration.GetValue<string>("RabbitMQ:Uri") ??
                      throw new InvalidOperationException("RabbitMQ Connection URI not found")),
        DispatchConsumersAsync = true
    };
    return connectionFactory.CreateConnection();
});

builder.Services.AddScoped<IModel>(serviceProvider =>
{
    var connection = serviceProvider.GetRequiredService<IConnection>();
    return connection.CreateModel();
});

builder.Services.AddScoped<IMessageProducer, MessageProducer>();

builder.Services.Configure<KestrelServerOptions>(options =>
{
    options.Limits.MaxRequestBodySize = 2L * 1024 * 1024 * 1024; // if don't set default value is: 30 MB
});

builder.Services.Configure<FormOptions>(x =>
{
    x.ValueLengthLimit = int.MaxValue;
    x.MultipartBodyLengthLimit = int.MaxValue;
    x.MultipartHeadersLengthLimit = int.MaxValue;
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthentication(IdentityConstants.ApplicationScheme)
    .AddGitHub("github", opt =>
    {
        opt.ClientId = builder.Configuration["OAuth:GitHub:ClientId"] ??
                       throw new InvalidOperationException("GitHub OAuth Client Id not found");
        opt.ClientSecret = builder.Configuration["OAuth:GitHub:ClientSecret"] ??
                           throw new InvalidOperationException("GitHub OAuth Client Secret not found");
        opt.SignInScheme = IdentityConstants.ExternalScheme;
    })
    .AddIdentityCookies();
builder.Services.AddAuthorizationBuilder();
builder.Services.AddIdentityCore<AppUser>(options =>
{
    options.SignIn.RequireConfirmedAccount = true;
    options.Password.RequireDigit = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
}).AddEntityFrameworkStores<DataContext>().AddApiEndpoints();

builder.Services.AddSingleton<IEmailSender<AppUser>, EmailSender>();

var app = builder.Build();

// https://pellerex.com/blog/google-auth-for-react-with-aspnet-identity
// Not sure if the following code should be uncommented
// app.Use((ctx, next) =>
// {
//     ctx.Request.Scheme = app.Configuration["FrontEnd:Scheme"] ?? throw new InvalidOperationException("Front End Scheme not found");
//     ctx.Request.Host = new HostString(app.Configuration["FrontEnd:Host"] ?? throw new InvalidOperationException("Front End Host not found"));
//     return next();
// });

using (var scope = app.Services.CreateScope())
{
    var dataContext = scope.ServiceProvider.GetRequiredService<DataContext>();
    dataContext.Database.Migrate();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UsePathBase("/api");
app.MapControllers();
app.UseAuthorization();
app.UseWebSockets();

app.UseMessagePublisher();
app.UseUnroutableMessageConsumer();

app.Run();