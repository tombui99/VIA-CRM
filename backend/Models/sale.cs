using System;
using System.Collections.Generic;

namespace Crm.Api.Models;

public partial class sale
{
    public long id { get; set; }

    public long lead_id { get; set; }

    public long parent_id { get; set; }

    public long center_id { get; set; }

    public long assigned_user_id { get; set; }

    public decimal sale_value { get; set; }

    public string status { get; set; } = null!;

    public DateTime created_at { get; set; }

    public DateTime? updated_at { get; set; }

    public virtual user assigned_user { get; set; } = null!;

    public virtual center center { get; set; } = null!;

    public virtual lead lead { get; set; } = null!;

    public virtual parent parent { get; set; } = null!;
}
