using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Crm.Api.Data;
using Crm.Api.Models;

namespace Crm.Api.Controllers;

[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly CrmDbContext _db;

    public DashboardController(CrmDbContext db)
    {
        _db = db;
    }

    [HttpGet("stats")]
    public async Task<ActionResult<DashboardStatsDto>> GetStats()
    {
        var stats = new DashboardStatsDto
        {
            LeadsBySource = await GetLeadsBySource(),
            LeadsByDate = await GetLeadsByDate(),
            ActivitiesByType = await GetActivitiesByType(),
            ActivitiesByOutcome = await GetActivitiesByOutcome()
        };

        return Ok(stats);
    }

    private async Task<List<LabelCountDto>> GetLeadsBySource()
    {
        return await (
            from l in _db.leads
            join s in _db.sources
                on l.source_id equals s.id into sourceGroup
            from s in sourceGroup.DefaultIfEmpty()
            group l by s.name into g
            select new LabelCountDto
            {
                Label = g.Key ?? "Unknown",
                Count = g.Count()
            }
        )
        .OrderByDescending(x => x.Count)
        .ToListAsync();
    }


    private async Task<List<DateCountDto>> GetLeadsByDate()
    {
        return await _db.leads
            .GroupBy(l => l.created_at.Date)
            .Select(g => new DateCountDto
            {
                Date = g.Key,
                Count = g.Count()
            })
            .OrderBy(x => x.Date)
            .ToListAsync();
    }

    private async Task<List<LabelCountDto>> GetActivitiesByType()
    {
        return await _db.lead_activities
            .GroupBy(a => a.activity_type)
            .Select(g => new LabelCountDto
            {
                Label = g.Key,
                Count = g.Count()
            })
            .OrderByDescending(x => x.Count)
            .ToListAsync();
    }

    private async Task<List<LabelCountDto>> GetActivitiesByOutcome()
    {
        return await _db.lead_activities
            .GroupBy(a => a.outcome)
            .Select(g => new LabelCountDto
            {
                Label = g.Key,
                Count = g.Count()
            })
            .OrderByDescending(x => x.Count)
            .ToListAsync();
    }

}
