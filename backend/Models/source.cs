using System;
using System.Collections.Generic;

namespace Crm.Api.Models;

public partial class source
{
    public long id { get; set; }

    public string name { get; set; } = null!;

    public bool? is_active { get; set; }

    public virtual ICollection<lead> leads { get; set; } = new List<lead>();
}
