using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Identity;
using MimeKit;
using Transcribey.Models;

namespace Transcribey.Utils;

public class EmailSender : IEmailSender<AppUser>, IDisposable
{
    private readonly SmtpClient _client;

    private readonly string _senderAddress;
    private bool _disposed;

    public EmailSender(IConfiguration configuration)
    {
        _senderAddress = configuration["Email:SenderAddress"] ??
                         throw new InvalidOperationException("Email Password not found");

        var smtpServer =
            configuration["Email:SMTPServer"] ?? throw new InvalidOperationException("SMTP Email Server not found");
        var smtpPort =
            configuration.GetValue<int?>("Email:SMTPPort") ??
            throw new InvalidOperationException("SMTP Email Port not found");
        var emailUsername =
            configuration["Email:Username"] ?? throw new InvalidOperationException("Email Username not found");
        var emailPassword =
            configuration["Email:Password"] ?? throw new InvalidOperationException("Email Password not found");

        _client = new SmtpClient();
        _client.Connect(smtpServer, smtpPort);
        _client.Authenticate(emailUsername, emailPassword);
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    public async Task SendConfirmationLinkAsync(AppUser user, string email, string confirmationLink)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Transcribey", _senderAddress));
        message.To.Add(new MailboxAddress(user.UserName, email));
        message.Subject = "Confirm Your Email";
        message.Body = new TextPart("plain")
        {
            Text = $"Your email confirmation link: {confirmationLink}\n\n\n" +
                   $"您的邮箱验证链接：{confirmationLink}"
        };
        await _client.SendAsync(message);
    }

    public async Task SendPasswordResetLinkAsync(AppUser user, string email, string resetLink)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Transcribey", _senderAddress));
        message.To.Add(new MailboxAddress(user.UserName, email));
        message.Subject = "Reset Your Password";
        message.Body = new TextPart("plain")
        {
            Text = $"Your password reset link: {resetLink}\n\n\n" +
                   $"您的重置密码链接：{resetLink}"
        };
        await _client.SendAsync(message);
    }

    public async Task SendPasswordResetCodeAsync(AppUser user, string email, string resetCode)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Transcribey", _senderAddress));
        message.To.Add(new MailboxAddress(user.UserName, email));
        message.Subject = "Reset Your Password";
        message.Body = new TextPart("plain")
        {
            Text = $"Your password reset code: {resetCode}\n\n\n" +
                   $"您的重置密码验证吗：{resetCode}"
        };
        await _client.SendAsync(message);
    }

    ~EmailSender()
    {
        Dispose(false);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (_disposed)
            return;

        if (disposing)
        {
            _client.Disconnect(true);
            _client.Dispose();
        }

        _disposed = true;
    }
}