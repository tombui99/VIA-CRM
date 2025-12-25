using System;
using System.Collections.Generic;

namespace Crm.Api.Models;

public partial class parent
{
    public long id { get; set; }

    public string name { get; set; } = null!;

    public string phone { get; set; } = null!;

    public string parent_character { get; set; } = null!;

    public string occupation { get; set; } = null!;

    public string dob { get; set; } = null!;

    public long? lead_id { get; set; }

    public virtual lead? lead { get; set; }
}
