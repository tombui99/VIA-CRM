using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Crm.Api.Data;
using Crm.Api.Models;
using CsvHelper;
using System.Globalization;

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
          source_id = l.source_id,
          region_id = l.region_id,
          center_id = l.center_id,
          assigned_user_id = l.assigned_user_id,
          assigned_team_id = l.assigned_team_id,
          is_duplicate = l.is_duplicate,
          duplicate_of = l.duplicate_of,
          center_name = center != null ? center.name : null,
          source_name = source != null ? source.name : null,
          assigned_user_name = user != null
                ? user.first_name + " " + user.last_name
                : null,
          created_at = l.created_at
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

  [HttpPost("import")]
  [Consumes("multipart/form-data")]
  public async Task<IActionResult> ImportLeads([FromForm] LeadImportRequest request)
  {
    var file = request.file;

    if (file == null || file.Length == 0)
      return BadRequest("CSV file is required");

    var leads = new List<lead>();

    using var reader = new StreamReader(file.OpenReadStream());
    using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);

    var records = csv.GetRecords<LeadImportDto>();

    foreach (var r in records)
    {
      if (string.IsNullOrWhiteSpace(r.first_name))
        continue;

      var lead = new lead
      {
        first_name = r.first_name.Trim(),
        last_name = r.last_name.Trim(),
        phone = r.phone,
        email = r.email,

        source_id = r.source_id,
        region_id = r.region_id,
        center_id = r.center_id,

        assigned_user_id = r.assigned_user_id,
        assigned_team_id = null,
        created_by = r.assigned_user_id,

        is_duplicate = false,
        duplicate_of = null,

        created_at = DateTime.UtcNow,
        updated_at = DateTime.UtcNow
      };

      leads.Add(lead);
    }

    _db.leads.AddRange(leads);
    await _db.SaveChangesAsync();

    return Ok(new
    {
      imported = leads.Count
    });
  }
}
