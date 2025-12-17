using System;
using System.Collections.Generic;

namespace Crm.Api.Models;

public partial class center
{
    public long id { get; set; }

    public string name { get; set; } = null!;

    public long region_id { get; set; }

    public string? address { get; set; }

    public virtual ICollection<appointment> appointments { get; set; } = new List<appointment>();

    public virtual ICollection<lead> leads { get; set; } = new List<lead>();

    public virtual region region { get; set; } = null!;

    public virtual ICollection<team> teams { get; set; } = new List<team>();
}
