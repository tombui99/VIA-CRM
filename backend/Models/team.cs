using System;
using System.Collections.Generic;

namespace Crm.Api.Models;

public partial class team
{
    public long id { get; set; }

    public long center_id { get; set; }

    public string name { get; set; } = null!;

    public virtual center center { get; set; } = null!;

    public virtual ICollection<lead> leads { get; set; } = new List<lead>();

    public virtual ICollection<user> users { get; set; } = new List<user>();
}
