using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Crm.Api.Data;
using Crm.Api.Models;

namespace Crm.Api.Controllers;

[ApiController]
[Route("api/parents")]
public class ParentsController : ControllerBase
{
    private readonly CrmDbContext _db;

    public ParentsController(CrmDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<parent>>> GetParentsWithLead()
    {
        var parents = await (
            from p in _db.parents
            join l in _db.leads on p.lead_id equals l.id into leadGroup
            from l in leadGroup.DefaultIfEmpty()
            select new parent
            {
                id = p.id,
                name = p.name,
                phone = p.phone,
                parent_character = p.parent_character,
                occupation = p.occupation,
                dob = p.dob,
                lead_id = p.lead_id,

                lead = l == null ? null : new lead
                {
                    id = l.id,
                    first_name = l.first_name,
                    last_name = l.last_name,
                    phone = l.phone,
                    email = l.email
                }
            }
        ).ToListAsync();

        return Ok(parents);
    }

}