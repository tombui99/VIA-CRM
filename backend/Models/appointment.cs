using System;
using System.Collections.Generic;

namespace Crm.Api.Models;

public partial class appointment
{
    public long id { get; set; }

    public long lead_id { get; set; }

    public long created_by { get; set; }

    public long center_id { get; set; }

    public string? appointment_type { get; set; }

    public string? appointment_time { get; set; }

    public string? status { get; set; }

    public virtual center center { get; set; } = null!;

    public virtual user created_byNavigation { get; set; } = null!;

    public virtual lead lead { get; set; } = null!;
}
