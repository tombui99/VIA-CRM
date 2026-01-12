public class RoleKpiDto
{
    public string Role { get; set; } = "";
    public int Users { get; set; }

    public int LeadsAssigned { get; set; }
    public int LeadsConverted { get; set; }
    public decimal TotalSalesValue { get; set; }
}
