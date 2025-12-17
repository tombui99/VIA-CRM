using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Crm.Api.Data;
using Crm.Api.Models;

namespace Crm.Api.Controllers;

[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{
    private readonly CrmDbContext _db;

    public UserController(CrmDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetAll()
    {
        var users = await (
                from u in _db.users
                join r in _db.user_roles on u.id equals r.id
                select new
                {
                    u.id,
                    u.first_name,
                    u.last_name,
                    u.email,
                    u.phone,
                    role_name = r.name
                }
            ).ToListAsync();

        return Ok(users);
    }

    [HttpGet("{id:long}")]
    public async Task<ActionResult<UserDto>> GetById(long id)
    {
        var user = await (
            from u in _db.users
            join r in _db.user_roles on u.role_id equals r.id
            where u.id == id
            select new
            {
                u.id,
                u.first_name,
                u.last_name,
                u.email,
                u.phone,
                role_name = r.name
            }
        ).FirstOrDefaultAsync();

        if (user == null)
            return NotFound();

        return Ok(user);
    }
}
