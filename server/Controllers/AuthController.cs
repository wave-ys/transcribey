using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Transcribey.Models;
using Transcribey.Utils;

namespace Transcribey.Controllers;

[Route("[controller]")]
[ApiController]
public class AuthController(
    IConfiguration configuration,
    SignInManager<AppUser> signInManager,
    IUserStore<AppUser> userStore,
    UserManager<AppUser> userManager,
    IEmailSender<AppUser> emailSender
) : ControllerBase
{
    private readonly string _frontEndHost =
        configuration["FrontEnd:Host"] ?? throw new InvalidOperationException("Front End Host not found");

    private readonly string _frontEndScheme =
        configuration["FrontEnd:Scheme"] ?? throw new InvalidOperationException("Front End Scheme not found");

    private string FrontEndUrl => $"{_frontEndScheme}://{_frontEndHost}";

    [HttpPost("log-out")]
    public async Task<ActionResult> LogOut()
    {
        await signInManager.SignOutAsync();
        return Ok();
    }

    [HttpGet("external-login")]
    public ActionResult ExternalLogin(string provider)
    {
        var properties = signInManager.ConfigureExternalAuthenticationProperties(provider,
            $"{FrontEndUrl}/api/auth/external-login-callback?provider=github");
        properties.AllowRefresh = true;
        return Challenge(properties, provider);
    }

    [HttpGet("external-login-callback")]
    public async Task<ActionResult> ExternalLoginCallback()
    {
        var info = await signInManager.GetExternalLoginInfoAsync();
        if (info == null)
            return BadRequest();
        var result = await signInManager.ExternalLoginSignInAsync(
            info.LoginProvider,
            info.ProviderKey,
            false,
            true);
        if (result.Succeeded)
            return Redirect($"{FrontEndUrl}");
        if (result.IsNotAllowed)
            return Redirect($"{FrontEndUrl}/account/login?failed=true&not_allowed=" +
                            (result.IsNotAllowed ? "true" : "false"));
        if (info.Principal.HasClaim(c => c.Type == ClaimTypes.Email))
            return Redirect(
                $"{FrontEndUrl}/account/supplement-email?default={UrlEncoder.Default.Encode(info.Principal.FindFirstValue(ClaimTypes.Email)!)}");
        return Redirect($"{FrontEndUrl}/account/supplement-email");
    }

    [HttpPost("external-login-callback")]
    public async Task<ActionResult> ExternalLoginCallbackPost([FromBody] JsonObject data)
    {
        var email = data["email"]?.GetValue<string>();
        if (string.IsNullOrEmpty(email))
            return BadRequest();

        var info = await signInManager.GetExternalLoginInfoAsync();
        if (info == null)
            return BadRequest();

        var result = await signInManager.ExternalLoginSignInAsync(
            info.LoginProvider,
            info.ProviderKey,
            false,
            true);
        if (result.Succeeded)
            return StatusCode(StatusCodes.Status208AlreadyReported);

        var appUser = new AppUser();
        await userStore.SetUserNameAsync(appUser, email, CancellationToken.None);
        await ((IUserEmailStore<AppUser>)userStore).SetEmailAsync(appUser, email, CancellationToken.None);

        if (!(await userManager.CreateAsync(appUser)).Succeeded)
            return StatusCode(StatusCodes.Status500InternalServerError);
        if (!(await userManager.AddLoginAsync(appUser, info)).Succeeded)
            return StatusCode(StatusCodes.Status500InternalServerError);

        await signInManager.SignInAsync(appUser, false, info.LoginProvider);

        var userId = await userManager.GetUserIdAsync(appUser);
        await SendEmailConfirm(userId, appUser);

        return Ok();
    }

    [HttpPost("log-in")]
    public async Task<ActionResult> LogIn(
        [FromForm] string email,
        [FromForm] string password,
        [FromForm] string? rememberMe)
    {
        var result =
            await signInManager.PasswordSignInAsync(email, password, rememberMe == "on", true);
        if (result.Succeeded)
            return Redirect(FrontEndUrl);
        return Redirect(
            $"{FrontEndUrl}/account/login?failed=true&not_allowed={(result.IsNotAllowed ? "true" : "false")}&locked={(result.IsLockedOut ? "true" : "false")}");
    }

    [HttpPost("sign-up")]
    public async Task<ActionResult> SignUp([FromForm] string email, [FromForm] string password)
    {
        var appUser = new AppUser();
        await userStore.SetUserNameAsync(appUser, email, CancellationToken.None);
        await ((IUserEmailStore<AppUser>)userStore).SetEmailAsync(appUser, email, CancellationToken.None);

        var result = await userManager.CreateAsync(appUser, password);
        if (!result.Succeeded)
        {
            var error = result.Errors.First().Description;

            // I wish Microsoft would enhance i18n support.
            if (Request.Cookies["i18n"] == "zh-cn")
            {
                if (error.Contains("Passwords must be at least"))
                    error = "密码必须大于等于 6 个字符";
                if (error.Contains("is already taken"))
                    error = "用户名 " + error.Split("\'")[1] + " 已被占用";
            }

            return Redirect($"{FrontEndUrl}/account/register?error=" +
                            UrlEncoder.Default.Encode(error));
        }

        var userId = await userManager.GetUserIdAsync(appUser);
        await SendEmailConfirm(userId, appUser);

        return Redirect($"{FrontEndUrl}/account/login?registered=true");
    }

    [HttpGet("info")]
    [Authorize]
    public async Task<ActionResult<AppUser>> GetUserInfo()
    {
        var user = await HttpContext.GetUserAsync();
        if (user == null)
            return Unauthorized();
        return user;
    }

    [HttpGet("confirm-email")]
    public async Task<ActionResult> ConfirmEmail([FromQuery(Name = "user_id")] string userId,
        [FromQuery(Name = "code")] string code)
    {
        if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(code))
            return NotFound();

        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
            return NotFound();

        var decoded = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(code));
        var result = await userManager.ConfirmEmailAsync(user, decoded);
        return Redirect(
            $"{FrontEndUrl}/account/confirm-email?user_id={userId}&success={(result.Succeeded ? "true" : "false")}");
    }

    [HttpPost("send-password-reset-link")]
    public async Task<ActionResult> SendResetPasswordLink([FromForm] string email)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user is null || !await userManager.IsEmailConfirmedAsync(user))
            return Ok();

        var code = await userManager.GeneratePasswordResetTokenAsync(user);
        code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
        var callbackUrl =
            $"{FrontEndUrl}/account/reset-password?email={HtmlEncoder.Default.Encode(email)}&code={code}";

        await emailSender.SendPasswordResetLinkAsync(user, email, callbackUrl);

        return Ok();
    }

    [HttpPost("reset-password")]
    public async Task<ActionResult> ResetPassword([FromForm] string code, [FromForm] string email,
        [FromForm] string password)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user == null)
            return Ok();

        code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(code));
        await userManager.ResetPasswordAsync(user, code, password);
        return Ok();
    }

    private async Task SendEmailConfirm(string userId, AppUser appUser)
    {
        var code = await userManager.GenerateEmailConfirmationTokenAsync(appUser);
        code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
        var callbackUrl =
            $"{FrontEndUrl}/api/auth/confirm-email?user_id={userId}&code={code}";
        await emailSender.SendConfirmationLinkAsync(appUser, appUser.Email!, callbackUrl);
    }
}