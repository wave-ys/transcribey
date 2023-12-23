using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Transcribey.Models;

namespace Transcribey.Controllers;

[Route("[controller]")]
[ApiController]
public class AuthController(
    IConfiguration configuration,
    SignInManager<AppUser> signInManager,
    IUserStore<AppUser> userStore,
    UserManager<AppUser> userManager) : ControllerBase
{
    private readonly string _frontEndHost =
        configuration["FrontEnd:Host"] ?? throw new InvalidOperationException("Front End Host not found");

    private readonly string _frontEndScheme =
        configuration["FrontEnd:Scheme"] ?? throw new InvalidOperationException("Front End Scheme not found");

    [HttpPost("log-out")]
    public async Task<ActionResult> LogOut()
    {
        await signInManager.SignOutAsync();
        return Ok();
    }

    [HttpGet("external-login")]
    public ActionResult ExternalLogin(string provider)
    {
        var frontEndUrl = $"{_frontEndScheme}://{_frontEndHost}";
        var properties = signInManager.ConfigureExternalAuthenticationProperties(provider,
            $"{frontEndUrl}/api/auth/external-login-callback?provider=github");
        properties.AllowRefresh = true;
        return Challenge(properties, provider);
    }

    [HttpGet("external-login-callback")]
    public async Task<ActionResult> ExternalLoginCallback(string provider)
    {
        var frontEndUrl = $"{_frontEndScheme}://{_frontEndHost}";
        var info = await signInManager.GetExternalLoginInfoAsync();
        if (info == null)
            return BadRequest();
        var result = await signInManager.ExternalLoginSignInAsync(
            info.LoginProvider,
            info.ProviderKey,
            false,
            true);
        if (result.Succeeded)
            return Redirect($"{frontEndUrl}");
        if (info.Principal.HasClaim(c => c.Type == ClaimTypes.Email))
            return Redirect(
                $"{frontEndUrl}/account/supplement-email?default={UrlEncoder.Default.Encode(info.Principal.FindFirstValue(ClaimTypes.Email)!)}");
        return Redirect($"{frontEndUrl}/account/supplement-email");
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

        if (!(await userStore.CreateAsync(appUser, CancellationToken.None)).Succeeded)
            return StatusCode(StatusCodes.Status500InternalServerError);
        if (!(await userManager.AddLoginAsync(appUser, info)).Succeeded)
            return StatusCode(StatusCodes.Status500InternalServerError);

        await signInManager.SignInAsync(appUser, false, info.LoginProvider);
        return Ok();
    }
}