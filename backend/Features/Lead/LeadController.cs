using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Crm.Api.Data;
using Crm.Api.Models;

namespace Crm.Api.Controllers;

[ApiController]
[Route("api/leads")]
public class LeadController : ControllerBase
{
    private readonly CrmDbContext _db;

    public LeadController(CrmDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<LeadDto>>> GetAll()
    {
        var leads = await (
            from l in _db.leads
            join c in _db.centers on l.center_id equals c.id into centerGroup
            from center in centerGroup.DefaultIfEmpty()
            join s in _db.sources on l.source_id equals s.id into sourceGroup
            from source in sourceGroup.DefaultIfEmpty()
            join u in _db.users on l.assigned_user_id equals u.id into userGroup
            from user in userGroup.DefaultIfEmpty()
            join la in _db.lead_activities on l.id equals la.lead_id into leadActivityGroup
            from leadActivity in leadActivityGroup.DefaultIfEmpty()
            select new LeadDto
            {
                id = l.id,
                first_name = l.first_name,
                last_name = l.last_name,
                phone = l.phone,
                email = l.email,
                center_name = center != null ? center.name : null,
                source_name = source != null ? source.name : null,
                assigned_user_name = user != null
                    ? user.first_name + " " + user.last_name
                    : null,
                lead_activities_type = leadActivity != null ? leadActivity.activity_type : null,
                lead_activities_outcome = leadActivity != null ? leadActivity.outcome : null,
            }).ToListAsync();

        return Ok(leads);
    }
}
