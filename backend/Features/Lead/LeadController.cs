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
            }).ToListAsync();

        return Ok(leads);
    }

    [HttpPost]
    public async Task<ActionResult<long>> Create(CreateUpdateLeadDto dto)
    {
        // Optional: simple duplicate check
        var duplicate = await _db.leads
            .Where(l => l.phone == dto.phone || l.email == dto.email)
            .Select(l => l.id)
            .FirstOrDefaultAsync();

        var lead = new lead
        {
            first_name = dto.first_name,
            last_name = dto.last_name,
            phone = dto.phone,
            email = dto.email,

            source_id = dto.source_id,
            region_id = dto.region_id,
            center_id = dto.center_id,

            assigned_user_id = dto.assigned_user_id,
            assigned_team_id = dto.assigned_team_id,

            is_duplicate = duplicate != 0,
            duplicate_of = duplicate != 0 ? duplicate : null
        };

        _db.leads.Add(lead);
        await _db.SaveChangesAsync();

        return Ok(lead.id);
    }

    [HttpPatch("{id:long}")]
    public async Task<IActionResult> Update(long id, CreateUpdateLeadDto dto)
    {
        var lead = await _db.leads.FindAsync(id);

        if (lead == null)
            return NotFound();

        // Optional: duplicate re-check (exclude current lead)
        var duplicateId = await _db.leads
            .Where(l =>
                l.id != id &&
                (l.phone == dto.phone || l.email == dto.email))
            .Select(l => l.id)
            .FirstOrDefaultAsync();

        lead.first_name = dto.first_name;
        lead.last_name = dto.last_name;
        lead.phone = dto.phone;
        lead.email = dto.email;

        lead.source_id = dto.source_id;
        lead.region_id = dto.region_id;
        lead.center_id = dto.center_id;

        lead.assigned_user_id = dto.assigned_user_id;
        lead.assigned_team_id = dto.assigned_team_id;
        lead.is_duplicate = duplicateId != 0;
        lead.duplicate_of = duplicateId != 0 ? duplicateId : null;

        await _db.SaveChangesAsync();

        return NoContent();
    }

}
