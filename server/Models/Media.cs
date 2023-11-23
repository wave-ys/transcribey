namespace Transcribey.Models;

public class Media
{
    public long Id { get; set; }

    public string StorePath { get; set; } = "";
    public string FileName { get; set; } = "";
    public string ResultPath { get; set; } = "";

    public string Model { get; set; } = "";
    public string Language { get; set; } = "";
    public string FileType { get; set; } = MediaFileType.Detecting;


    public string Status { get; set; } = MediaStatus.Created;
    public bool Failed { get; set; }
    public string FailedReason { get; set; } = "";

    public bool Deleted { get; set; }
    public DateTime CreatedTime { get; set; }

    public long WorkspaceId { get; set; }
    public Workspace Workspace { get; set; } = default!;
}

public class MediaFileType
{
    public const string Audio = "audio";
    public const string Video = "video";
    public const string Detecting = "detecting";
}

public class MediaStatus
{
    public const string Created = "created";
    public const string Transcribing = "transcribing";
    public const string Completed = "completed";
}

public class MediaFailedReason
{
    public const string Unroutable = "unroutable";
}