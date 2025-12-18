using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Crm.Api.Data;
using Crm.Api.Models;

namespace Crm.Api.Controllers;

[ApiController]
[Route("api/leadActivities")]
public class LeadActivitiesController : ControllerBase
{
    private readonly CrmDbContext _db;

    public LeadActivitiesController(CrmDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<LeadActivitiesDto>>> GetLeadActivities()
    {
        var leads = await _db.leads
            .Select(l => new LeadActivitiesDto
            {
                id = l.id,
                first_name = l.first_name,
                last_name = l.last_name,
                phone = l.phone,
                email = l.email,
                source_id = l.source_id,
                region_id = l.region_id,
                center_id = l.center_id,

                assigned_user_id = l.assigned_user_id,
                assigned_team_id = l.assigned_team_id,

                is_duplicate = l.is_duplicate,
                duplicate_of = l.duplicate_of,

                activities = _db.lead_activities
                    .Where(a => a.lead_id == l.id)
                    .OrderByDescending(a => a.created_at)
                    .Select(a => new lead_activity
                    {
                        id = a.id,
                        lead_id = a.lead_id,
                        user_id = a.user_id,
                        activity_type = a.activity_type,
                        outcome = a.outcome,
                        created_at = a.created_at,
                    })
                    .ToList()
            })
            .ToListAsync();

        return Ok(leads);
    }


}