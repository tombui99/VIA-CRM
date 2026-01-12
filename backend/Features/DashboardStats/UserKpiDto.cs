public class UserKpiDto
{
    public long UserId { get; set; }
    public string UserName { get; set; } = "";
    public int LeadsAssigned { get; set; }
    public int LeadsContacted { get; set; }
    public int LeadsConverted { get; set; }
    public decimal TotalSalesValue { get; set; }
    public decimal ConversionRate { get; set; }
}
