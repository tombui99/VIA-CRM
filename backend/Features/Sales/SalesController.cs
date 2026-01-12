using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Crm.Api.Data;

namespace Crm.Api.Controllers;

[ApiController]
[Route("api/sales")]
public class SalesController : ControllerBase
{
    private readonly CrmDbContext _db;

    public SalesController(CrmDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult> GetAllSales()
    {
        var sales = await (
            from s in _db.sales
            join l in _db.leads on s.lead_id equals l.id
            join p in _db.parents on s.parent_id equals p.id
            join c in _db.centers on s.center_id equals c.id
            join u in _db.users on s.assigned_user_id equals u.id
            select new
            {
                s.id,
                s.sale_value,
                s.status,
                s.created_at,

                lead = new
                {
                    l.id,
                    l.first_name,
                    l.last_name,
                    l.phone,
                    l.email
                },

                parent = new
                {
                    p.id,
                    p.name,
                    p.phone
                },

                center = new
                {
                    c.id,
                    c.name
                },

                assigned_user = new
                {
                    u.id,
                    u.first_name,
                    u.last_name
                }
            }
        ).AsNoTracking().ToListAsync();

        return Ok(sales);
    }


}