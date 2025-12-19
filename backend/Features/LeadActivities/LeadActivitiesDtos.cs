using System;
using System.Collections.Generic;
using Crm.Api.Models;

public class LeadActivitiesDto
{
    public long id { get; set; }

    public string first_name { get; set; } = null!;
    public string last_name { get; set; } = null!;
    public string phone { get; set; } = null!;
    public string email { get; set; } = null!;

    public long? source_id { get; set; }
    public long? region_id { get; set; }
    public long? center_id { get; set; }

    public long? assigned_user_id { get; set; }
    public long? assigned_team_id { get; set; }

    public bool? is_duplicate { get; set; }
    public long? duplicate_of { get; set; }

    public List<lead_activity> activities { get; set; } = [];
}

public class CreateLeadActivityDto
{
    public long lead_id { get; set; }
    public long user_id { get; set; }
    public string activity_type { get; set; } = null!;
    public string outcome { get; set; } = null!;
}

public class UpdateLeadActivityDto
{
    public string activity_type { get; set; } = null!;
    public string outcome { get; set; } = null!;
}