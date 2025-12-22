using Microsoft.EntityFrameworkCore;
using Crm.Api.Data;

public interface ILeadService
{
    Task<List<LeadDto>> GetAllAsync(
        string? sortField,
        string? sortDirection
    );
}

public class LeadService : ILeadService
{
    private readonly CrmDbContext _db;

    private static readonly HashSet<string> SortableFields = new()
    {
        "id",
        "first_name",
        "last_name",
        "email",
        "phone",
        "created_at",
        "priority_id",
        "center_name",
        "source_name",
        "assigned_user_name"
    };

    public LeadService(CrmDbContext db)
    {
        _db = db;
    }

    public async Task<List<LeadDto>> GetAllAsync(
        string? sortField,
        string? sortDirection
    )
    {
        var query =
            from l in _db.leads
            join c in _db.centers on l.center_id equals c.id into centerGroup
            from center in centerGroup.DefaultIfEmpty()
            join s in _db.sources on l.source_id equals s.id into sourceGroup
            from source in sourceGroup.DefaultIfEmpty()
            join u in _db.users on l.assigned_user_id equals u.id into userGroup
            from user in userGroup.DefaultIfEmpty()
            join p in _db.priorities on l.priority_id equals p.id into priorityGroup
            from priority in priorityGroup.DefaultIfEmpty()
            select new LeadDto
            {
                id = l.id,
                first_name = l.first_name,
                last_name = l.last_name,
                phone = l.phone,
                email = l.email,
                source_id = l.source_id,
                priority_id = l.priority_id,
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
                created_at = l.created_at,
                priority = priority != null ? priority.name : null
            };

        // 🔹 Apply sorting
        query = ApplySorting(query, sortField, sortDirection);

        return await query.ToListAsync();
    }

    private static IQueryable<LeadDto> ApplySorting(
        IQueryable<LeadDto> query,
        string? sortField,
        string? sortDirection
    )
    {
        bool isDesc = sortDirection?.ToLower() == "desc";

        if (!string.IsNullOrWhiteSpace(sortField) &&
            SortableFields.Contains(sortField))
        {
            return query.OrderByProperty(sortField, isDesc);
        }

        // Default sort
        return query.OrderByDescending(x => x.created_at);
    }
}
