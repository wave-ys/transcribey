namespace Transcribey.Models;

public class Media
{
    public long Id { get; set; }
    public string StorePath { get; set; } = "";
    public string FileName { get; set; } = "";
    public string FileType { get; set; } = MediaFileType.Detecting;
    public bool Deleted { get; set; }
    public DateTime CreatedTime { get; set; }
    public long WorkspaceId { get; set; }
    public Workspace Workspace { get; set; } = default!;
}

public class MediaFileType
{
    public static readonly string Audio = "audio";
    public static readonly string Video = "video";
    public static readonly string Detecting = "detecting";
}