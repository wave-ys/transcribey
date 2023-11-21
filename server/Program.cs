using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.EntityFrameworkCore;
using Minio;
using RabbitMQ.Client;
using Transcribey.Data;

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

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseMessagePublisher();
app.UseUnroutableMessageConsumer();

app.Run();