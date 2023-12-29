using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace Transcribey.Models;

public class Workspace
{
    public long Id { get; set; }
    public string Label { get; set; } = "";
    public string Color { get; set; } = "";

    public string AppUserId { get; set; } = "";
    [JsonIgnore] [ValidateNever] public AppUser AppUser { get; set; } = default!;
}