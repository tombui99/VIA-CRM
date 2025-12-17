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
    public async Task<ActionResult<IEnumerable<lead>>> GetAll()
    {
        return Ok(await _db.leads.ToListAsync());
    }

    [HttpGet("{id:long}")]
    public async Task<ActionResult<lead>> GetById(long id)
    {
        var lead = await _db.leads.FindAsync(id);

        if (lead == null)
            return NotFound();

        return Ok(lead);
    }
}
