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
            ActivitiesByOutcome = await GetActivitiesByOutcome(),
            UserKpis = await GetUserKpis(),
            RoleKpis = await GetRoleKpis()
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
        .AsNoTracking()
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
            .AsNoTracking()
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
            .AsNoTracking()
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
            .AsNoTracking()
            .ToListAsync();
    }

    private async Task<List<UserKpiDto>> GetUserKpis()
    {
        var raw = await (
            from u in _db.users

            select new
            {
                UserId = u.id,
                UserName = u.first_name + " " + u.last_name,

                // -------------------------
                // LEADS KPIs (lead owner)
                // -------------------------
                LeadsAssigned = _db.leads.Count(l => l.assigned_user_id == u.id),

                LeadsContacted = (
                    from l in _db.leads
                    join a in _db.lead_activities on l.id equals a.lead_id
                    where l.assigned_user_id == u.id
                    select l.id
                ).Distinct().Count(),

                LeadsConverted = (
                    from s in _db.sales
                    where s.assigned_user_id == u.id
                    select s.lead_id
                ).Distinct().Count(),

                // -------------------------
                // SALES KPIs (sale owner) ✅
                // -------------------------
                TotalSalesValue = (
                    from s in _db.sales
                    where s.assigned_user_id == u.id
                    select (decimal?)s.sale_value
                ).Sum()
            }
        ).AsNoTracking().ToListAsync();

        return raw
            .Select(x => new UserKpiDto
            {
                UserId = x.UserId,
                UserName = x.UserName,

                LeadsAssigned = x.LeadsAssigned,
                LeadsContacted = x.LeadsContacted,
                LeadsConverted = x.LeadsConverted,

                TotalSalesValue = x.TotalSalesValue ?? 0m,

                ConversionRate = x.LeadsAssigned == 0
                    ? 0
                    : Math.Round(
                        (decimal)x.LeadsConverted / x.LeadsAssigned * 100m,
                        2
                    )
            })
            .OrderByDescending(x => x.TotalSalesValue)
            .ToList();
    }
    private async Task<List<RoleKpiDto>> GetRoleKpis()
    {
        return await (
            from r in _db.user_roles
            join u in _db.users on r.id equals u.role_id

            group new { r, u } by r.name into g

            select new RoleKpiDto
            {
                Role = g.Key,
                Users = g.Count(),

                // Leads owned by users in this role
                LeadsAssigned = (
                    from l in _db.leads
                    join gu in g.Select(x => x.u.id)
                        on l.assigned_user_id equals gu
                    select l.id
                ).Count(),

                LeadsConverted = (
                    from l in _db.leads
                    join gu in g.Select(x => x.u.id)
                        on l.assigned_user_id equals gu
                    join s in _db.sales on l.id equals s.lead_id
                    where s.parent_id == null
                    select l.id
                ).Distinct().Count(),

                // Sales CLOSED by users in this role
                TotalSalesValue = (
                    from s in _db.sales
                    join gu in g.Select(x => x.u.id)
                        on s.assigned_user_id equals gu
                    where s.parent_id == null
                    select (decimal?)s.sale_value
                ).Sum() ?? 0m
            }
        )
        .OrderByDescending(x => x.TotalSalesValue)
        .AsNoTracking()
        .ToListAsync();
    }
}
