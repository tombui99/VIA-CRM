public class DashboardStatsDto
{
    public List<LabelCountDto> LeadsBySource { get; set; } = [];
    public List<DateCountDto> LeadsByDate { get; set; } = [];
    public List<LabelCountDto> ActivitiesByType { get; set; } = [];
    public List<LabelCountDto> ActivitiesByOutcome { get; set; } = [];
}

public class LabelCountDto
{
    public string Label { get; set; } = null!;
    public int Count { get; set; }
}

public class DateCountDto
{
    public DateTime Date { get; set; }
    public int Count { get; set; }
}
