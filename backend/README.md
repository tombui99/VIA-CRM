# Backend

This project was generated using .NET 10

## Development server

Add the config file:

`appsettings.Development.json`

Run scaffold against MySQL to get updates:

```bash
dotnet ef dbcontext scaffold \
"Server=localhost;Port=3306;Database=databasename;User=username;Password=password;" \
Pomelo.EntityFrameworkCore.MySql \
--output-dir Models \
--context CrmDbContext \
--context-dir Data \
--use-database-names \
--no-onconfiguring;
```

To start a local development server, run:

```bash
dotnet run
```
