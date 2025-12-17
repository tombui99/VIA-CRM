using System;
using System.Collections.Generic;

namespace Crm.Api.Models;

public partial class lead_note
{
    public long id { get; set; }

    public long lead_id { get; set; }

    public long user_id { get; set; }

    public string note { get; set; } = null!;

    public DateTime? created_at { get; set; }

    public virtual lead lead { get; set; } = null!;

    public virtual user user { get; set; } = null!;
}
