using System;
using System.Collections.Generic;

namespace Crm.Api.Models;

public partial class user
{
    public long id { get; set; }

    public string? first_name { get; set; }

    public string? last_name { get; set; }

    public string? email { get; set; }

    public string? phone { get; set; }

    public long role_id { get; set; }

    public long? team_id { get; set; }

    public long? region_id { get; set; }

    public bool? is_active { get; set; }

    public DateTime? created_at { get; set; }

    public virtual ICollection<appointment> appointments { get; set; } = new List<appointment>();

    public virtual ICollection<auth_user> auth_users { get; set; } = new List<auth_user>();

    public virtual ICollection<lead_activity> lead_activities { get; set; } = new List<lead_activity>();

    public virtual ICollection<lead_note> lead_notes { get; set; } = new List<lead_note>();

    public virtual ICollection<lead> leadassigned_users { get; set; } = new List<lead>();

    public virtual ICollection<lead> leadcreated_byNavigations { get; set; } = new List<lead>();

    public virtual region? region { get; set; }

    public virtual user_role role { get; set; } = null!;

    public virtual team? team { get; set; }
}
