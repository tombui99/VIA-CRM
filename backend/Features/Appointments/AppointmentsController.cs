using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Crm.Api.Data;
using Crm.Api.Models;

namespace Crm.Api.Controllers;

[ApiController]
[Route("api/appointments")]
public class AppointmentsController : ControllerBase
{
    private readonly CrmDbContext _db;

    public AppointmentsController(CrmDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<appointment>>> GetAppointments()
    {
        var appointments = await (
            from a in _db.appointments
            join l in _db.leads on a.lead_id equals l.id into leadGroup
            from l in leadGroup.DefaultIfEmpty()
            join c in _db.centers on a.center_id equals c.id into centerGroup
            from c in centerGroup.DefaultIfEmpty()
            join u in _db.users on a.created_by equals u.id into userGroup
            from u in userGroup.DefaultIfEmpty()
            select new appointment
            {
                id = a.id,
                appointment_type = a.appointment_type,
                appointment_time = a.appointment_time,
                status = a.status,
                lead = new lead
                {
                    id = l.id,
                    first_name = l.first_name,
                    last_name = l.last_name,
                    phone = l.phone,
                    email = l.email
                },
                user = new user
                {
                    id = u.id,
                    first_name = u.first_name,
                    last_name = u.last_name
                }
            }
        ).ToListAsync();

        return Ok(appointments);
    }

}