using Microsoft.AspNetCore.Identity;
using Transcribey.Models;

namespace Transcribey.Utils;

public static class RequestExtensions
{
    public static async Task<string> ReadAsStringAsync(this Stream requestBody, bool leaveOpen = false)
    {
        using StreamReader reader = new(requestBody, leaveOpen: leaveOpen);
        var bodyAsString = await reader.ReadToEndAsync();
        return bodyAsString;
    }

    public static async Task<AppUser?> GetUserAsync(this HttpContext httpContext)
    {
        var userManager = httpContext.RequestServices.GetRequiredService<UserManager<AppUser>>();
        return await userManager.GetUserAsync(httpContext.User);
    }
}