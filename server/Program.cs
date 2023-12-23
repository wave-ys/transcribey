using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.EntityFrameworkCore;
using Minio;
using RabbitMQ.Client;
using Transcribey.Data;
using Transcribey.Models;

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

builder.Services.AddAuthentication()
    .AddBearerToken(IdentityConstants.BearerScheme);
builder.Services.AddAuthorizationBuilder();
builder.Services.AddIdentityCore<AppUser>().AddEntityFrameworkStores<DataContext>().AddApiEndpoints();

var app = builder.Build();

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
app.MapGroup("/auth").MapIdentityApi<AppUser>();

app.UseMessagePublisher();
app.UseUnroutableMessageConsumer();

app.Run();