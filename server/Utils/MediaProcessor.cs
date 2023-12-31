using System.Diagnostics;
using System.Text.Json.Nodes;
using Transcribey.Models;

namespace Transcribey.Utils;

public static class MediaProcessor
{
    public static async Task<string> DetectFileType(string path)
    {
        try
        {
            using var process = new Process();
            process.StartInfo.FileName = "ffprobe";
            process.StartInfo.Arguments = $"-show_streams -print_format json -loglevel quiet \"{path}\"";
            process.StartInfo.RedirectStandardOutput = true;
            process.Start();
            await process.WaitForExitAsync();

            var output = await process.StandardOutput.ReadToEndAsync();
            var streams = JsonNode.Parse(output)!["streams"]!.AsArray();
            var videoExist = streams.Any(stream => stream!["codec_type"]!.GetValue<string>() == "video");
            var audioExist = streams.Any(stream => stream!["codec_type"]!.GetValue<string>() == "audio");

            if (!videoExist && !audioExist)
                return MediaFileType.Error;
            if (videoExist)
                return MediaFileType.Video;
            return MediaFileType.Audio;
        }
        catch (Exception e)
        {
            return MediaFileType.Error;
        }
    }

    public static async Task<double> GetDuration(string path)
    {
        try
        {
            using var process = new Process();
            process.StartInfo.FileName = "ffprobe";
            process.StartInfo.Arguments = $"-i \"{path}\" -show_entries format=duration -v quiet -of csv=\"p=0\"";
            process.StartInfo.RedirectStandardOutput = true;
            process.Start();
            await process.WaitForExitAsync();

            var output = await process.StandardOutput.ReadToEndAsync();
            return double.Parse(output);
        }
        catch (Exception e)
        {
            return 0;
        }
    }

    public static async Task GenerateThumbnail(string mediaPath, string outputPath)
    {
        using var process = new Process();
        process.StartInfo.FileName = "ffmpeg";
        process.StartInfo.Arguments =
            $"-loglevel quiet -i \"{mediaPath}\" -vf thumbnail=300 -frames:v 1 -y \"{outputPath}\"";
        process.Start();
        await process.WaitForExitAsync();
    }

    public static async Task EmbedSoftSubtitles(string mediaPath, string subtitlesPath, string outputPath)
    {
        using var process = new Process();
        process.StartInfo.FileName = "ffmpeg";
        process.StartInfo.Arguments =
            $"-loglevel quiet -i \"{mediaPath}\" -i \"{subtitlesPath}\" -c copy -c:s mov_text \"{outputPath}\"";
        process.Start();
        await process.WaitForExitAsync();
    }
}