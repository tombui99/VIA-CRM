using System;
using System.Collections.Generic;
using Crm.Api.Models;

public class LeadDto
{
    public long id { get; set; }

    public string? first_name { get; set; }

    public string? last_name { get; set; }

    public string? phone { get; set; }

    public string? email { get; set; }

    public long? priority_id { get; set; }

    public long? source_id { get; set; }

    public long? region_id { get; set; }

    public long? center_id { get; set; }

    public long? assigned_user_id { get; set; }

    public long? assigned_team_id { get; set; }

    public long? created_by { get; set; }

    public DateTime? created_at { get; set; }

    public bool? is_duplicate { get; set; }

    public long? duplicate_of { get; set; }

    public virtual ICollection<lead> Inverseduplicate_ofNavigation { get; set; } = new List<lead>();

    public virtual ICollection<appointment> appointments { get; set; } = new List<appointment>();

    public virtual team? assigned_team { get; set; }

    public virtual user? assigned_user { get; set; }

    public virtual center? center { get; set; }

    public virtual user? created_byNavigation { get; set; }

    public virtual lead? duplicate_ofNavigation { get; set; }

    public virtual ICollection<lead_activity> lead_activities { get; set; } = new List<lead_activity>();

    public virtual ICollection<lead_note> lead_notes { get; set; } = new List<lead_note>();

    public virtual region? region { get; set; }

    public virtual source? source { get; set; }

    // extra field
    public string? center_name { get; set; }
    public string? source_name { get; set; }
    public string? assigned_user_name { get; set; }
    public string? priority { get; set; }
}

public class CreateUpdateLeadDto
{
    public string first_name { get; set; } = null!;
    public string last_name { get; set; } = null!;
    public string phone { get; set; } = null!;
    public string email { get; set; } = null!;
    public long? priority_id { get; set; }
    public long? source_id { get; set; }
    public long? region_id { get; set; }
    public long? center_id { get; set; }

    public long? assigned_user_id { get; set; }
    public long? assigned_team_id { get; set; }
}

public class LeadImportDto
{
    public string first_name { get; set; } = null!;
    public string last_name { get; set; } = null!;
    public string? phone { get; set; }
    public string? email { get; set; }
    public long assigned_user_id { get; set; }
    public long source_id { get; set; }
    public long region_id { get; set; }
    public long center_id { get; set; }
}

public class LeadImportRequest
{
    public IFormFile file { get; set; } = null!;
}

