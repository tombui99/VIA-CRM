using System;
using System.Collections.Generic;

namespace Crm.Api.Models;

public partial class user_role
{
    public long id { get; set; }

    public string name { get; set; } = null!;

    public string? description { get; set; }

    public virtual ICollection<user> users { get; set; } = new List<user>();
}
