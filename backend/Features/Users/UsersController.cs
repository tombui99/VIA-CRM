using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Crm.Api.Data;
using Crm.Api.Models;

namespace Crm.Api.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly CrmDbContext _db;

    public UsersController(CrmDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<user>>> GetAll()
    {
        return Ok(await _db.users.ToListAsync());
    }

    [HttpGet("{id:long}")]
    public async Task<ActionResult<user>> GetById(long id)
    {
        var user = await _db.users.FindAsync(id);

        if (user == null)
            return NotFound();

        return Ok(user);
    }
}
