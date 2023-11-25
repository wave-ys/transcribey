namespace Transcribey.Utils;

public class RangeRequestUtils
{
    public const string PartialBoundary = "IWISHDOTNETWILLENHANCERANGEREQUESTSUPPORT";

    public static List<RangeRequestItem>? ParseRangeHeader(string? rangeHeaderValue, long size)
    {
        if (string.IsNullOrEmpty(rangeHeaderValue))
            return null;
        if (!rangeHeaderValue.StartsWith("bytes="))
            return null;

        var result = new List<RangeRequestItem>();
        var ranges = rangeHeaderValue.Replace("bytes=", "").Split(",").Select(s => s.Trim()).ToList();
        foreach (var range in ranges)
        {
            var split = range.Split("/");
            var points = split[0].Split("-").Select(s => s.Trim()).ToList();
            if (points.Count != 2)
                return null;

            var startByte = long.TryParse(points[0], out var parsed1) ? parsed1 : 0;
            var endByte = long.TryParse(points[1], out var parsed2) ? parsed2 : size - 1;
            result.Add(new RangeRequestItem(startByte, endByte, range));
        }

        return result;
    }
}

public record RangeRequestItem(long From, long To, string OriginString);