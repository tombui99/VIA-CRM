using System;
using System.Collections.Generic;

namespace Crm.Api.Models;

public partial class lead_activity
{
    public long id { get; set; }

    public long lead_id { get; set; }

    public long user_id { get; set; }

    public string activity_type { get; set; } = null!;

    public string? outcome { get; set; }

    public DateTime? created_at { get; set; }

    public virtual lead lead { get; set; } = null!;

    public virtual user user { get; set; } = null!;
}
