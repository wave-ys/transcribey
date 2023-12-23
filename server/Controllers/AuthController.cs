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
    private readonly string _frontEndUrl =
        configuration["FrontEnd"] ?? throw new InvalidOperationException("Front End Url not found");

    [HttpGet("external-login")]
    public ActionResult ExternalLogin(string provider)
    {
        var properties = signInManager.ConfigureExternalAuthenticationProperties(provider,
            $"{_frontEndUrl}/api/auth/external-login-callback?provider=github");
        properties.AllowRefresh = true;
        return Challenge(properties, provider);
    }

    [HttpGet("external-login-callback")]
    public async Task<ActionResult> ExternalLoginCallback(string provider)
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
            return Redirect($"{_frontEndUrl}");
        if (info.Principal.HasClaim(c => c.Type == ClaimTypes.Email))
            return Redirect(
                $"{_frontEndUrl}/account/supplement-email?default={UrlEncoder.Default.Encode(info.Principal.FindFirstValue(ClaimTypes.Email)!)}");
        return Redirect($"{_frontEndUrl}/account/supplement-email");
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