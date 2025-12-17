using System;
using System.Collections.Generic;

namespace Crm.Api.Models;

public partial class auth_user
{
    public long id { get; set; }

    public long user_id { get; set; }

    public string username { get; set; } = null!;

    public string password_hash { get; set; } = null!;

    public bool? is_active { get; set; }

    public DateTime? created_at { get; set; }

    public virtual user user { get; set; } = null!;
}
