using System;
using System.Collections.Generic;

namespace Crm.Api.Models;

public partial class region
{
    public long id { get; set; }

    public string name { get; set; } = null!;

    public string code { get; set; } = null!;

    public virtual ICollection<center> centers { get; set; } = new List<center>();

    public virtual ICollection<lead> leads { get; set; } = new List<lead>();

    public virtual ICollection<user> users { get; set; } = new List<user>();
}
