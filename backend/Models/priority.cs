using System;
using System.Collections.Generic;

namespace Crm.Api.Models;

public partial class priority
{
    public long id { get; set; }

    public string name { get; set; } = null!;

    public int sort_order { get; set; }

    public DateTime created_at { get; set; }

    public DateTime updated_at { get; set; }

    public virtual ICollection<lead> leads { get; set; } = new List<lead>();
}
