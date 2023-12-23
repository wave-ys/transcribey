using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Authorization;
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

    public string FrontEndUrl => $"{_frontEndScheme}://{_frontEndHost}";

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
            return Redirect($"{FrontEndUrl}");
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
        return Ok();
    }

    [HttpPost("log-in")]
    public async Task<ActionResult> LogIn(
        [FromForm] string email,
        [FromForm] string password,
        [FromForm] string? rememberMe)
    {
        var result =
            await signInManager.PasswordSignInAsync(email, password, rememberMe == "on", false);
        if (result.Succeeded)
            return Redirect(FrontEndUrl);
        return Redirect($"{FrontEndUrl}/account/login?failed=true");
    }

    [HttpPost("sign-up")]
    public async Task<ActionResult> SignUp([FromForm] string email, [FromForm] string password)
    {
        var appUser = new AppUser();
        await userStore.SetUserNameAsync(appUser, email, CancellationToken.None);
        await ((IUserEmailStore<AppUser>)userStore).SetEmailAsync(appUser, email, CancellationToken.None);

        var result = await userManager.CreateAsync(appUser, password);
        if (!result.Succeeded)
            return Redirect($"{FrontEndUrl}/account/login?error=" +
                            UrlEncoder.Default.Encode(result.Errors.First().Description));

        return Redirect($"{FrontEndUrl}/account/login");
    }

    [HttpGet("info")]
    [Authorize]
    public async Task<ActionResult<AppUser>> GetUserInfo()
    {
        var user = await userManager.GetUserAsync(HttpContext.User);
        if (user == null)
            return Unauthorized();
        return user;
    }
}