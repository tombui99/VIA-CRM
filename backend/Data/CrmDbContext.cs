using System;
using System.Collections.Generic;
using Crm.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Crm.Api.Data;

public partial class CrmDbContext : DbContext
{
    public CrmDbContext(DbContextOptions<CrmDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<appointment> appointments { get; set; }

    public virtual DbSet<auth_user> auth_users { get; set; }

    public virtual DbSet<center> centers { get; set; }

    public virtual DbSet<lead> leads { get; set; }

    public virtual DbSet<lead_activity> lead_activities { get; set; }

    public virtual DbSet<lead_note> lead_notes { get; set; }

    public virtual DbSet<region> regions { get; set; }

    public virtual DbSet<source> sources { get; set; }

    public virtual DbSet<team> teams { get; set; }

    public virtual DbSet<user> users { get; set; }

    public virtual DbSet<user_role> user_roles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_unicode_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<appointment>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PRIMARY");

            entity.UseCollation("utf8mb4_0900_ai_ci");

            entity.HasIndex(e => e.center_id, "fk_appointments_center");

            entity.HasIndex(e => e.created_by, "fk_appointments_created_by");

            entity.HasIndex(e => new { e.lead_id, e.created_by, e.center_id }, "idx_appointments_lead_creator_center");

            entity.Property(e => e.appointment_time).HasMaxLength(100);
            entity.Property(e => e.appointment_type).HasMaxLength(100);
            entity.Property(e => e.status).HasMaxLength(50);

            entity.HasOne(d => d.center).WithMany(p => p.appointments)
                .HasForeignKey(d => d.center_id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_appointments_center");

            entity.HasOne(d => d.created_byNavigation).WithMany(p => p.appointments)
                .HasForeignKey(d => d.created_by)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_appointments_created_by");

            entity.HasOne(d => d.lead).WithMany(p => p.appointments)
                .HasForeignKey(d => d.lead_id)
                .HasConstraintName("fk_appointments_lead");
        });

        modelBuilder.Entity<auth_user>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PRIMARY");

            entity.UseCollation("utf8mb4_0900_ai_ci");

            entity.HasIndex(e => e.user_id, "fk_auth_users_user");

            entity.HasIndex(e => e.username, "uq_auth_users_username").IsUnique();

            entity.Property(e => e.created_at)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.is_active).HasDefaultValueSql("'1'");
            entity.Property(e => e.password_hash).HasMaxLength(255);
            entity.Property(e => e.username).HasMaxLength(100);

            entity.HasOne(d => d.user).WithMany(p => p.auth_users)
                .HasForeignKey(d => d.user_id)
                .HasConstraintName("fk_auth_users_user");
        });

        modelBuilder.Entity<center>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PRIMARY");

            entity.UseCollation("utf8mb4_0900_ai_ci");

            entity.HasIndex(e => e.region_id, "idx_centers_region_id");

            entity.Property(e => e.address).HasMaxLength(255);
            entity.Property(e => e.name).HasMaxLength(255);

            entity.HasOne(d => d.region).WithMany(p => p.centers)
                .HasForeignKey(d => d.region_id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_centers_region");
        });

        modelBuilder.Entity<lead>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PRIMARY");

            entity.UseCollation("utf8mb4_0900_ai_ci");

            entity.HasIndex(e => e.assigned_team_id, "fk_leads_assigned_team");

            entity.HasIndex(e => e.center_id, "fk_leads_center");

            entity.HasIndex(e => e.created_by, "fk_leads_created_by");

            entity.HasIndex(e => e.region_id, "fk_leads_region");

            entity.HasIndex(e => e.assigned_user_id, "idx_leads_assigned_user");

            entity.HasIndex(e => e.duplicate_of, "idx_leads_duplicate_of");

            entity.HasIndex(e => new { e.source_id, e.region_id, e.center_id }, "idx_leads_source_region_center");

            entity.Property(e => e.email).HasMaxLength(255);
            entity.Property(e => e.first_name).HasMaxLength(100);
            entity.Property(e => e.is_duplicate).HasDefaultValueSql("'0'");
            entity.Property(e => e.last_name).HasMaxLength(100);
            entity.Property(e => e.phone).HasMaxLength(50);

            entity.HasOne(d => d.assigned_team).WithMany(p => p.leads)
                .HasForeignKey(d => d.assigned_team_id)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("fk_leads_assigned_team");

            entity.HasOne(d => d.assigned_user).WithMany(p => p.leadassigned_users)
                .HasForeignKey(d => d.assigned_user_id)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("fk_leads_assigned_user");

            entity.HasOne(d => d.center).WithMany(p => p.leads)
                .HasForeignKey(d => d.center_id)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("fk_leads_center");

            entity.HasOne(d => d.created_byNavigation).WithMany(p => p.leadcreated_byNavigations)
                .HasForeignKey(d => d.created_by)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("fk_leads_created_by");

            entity.HasOne(d => d.duplicate_ofNavigation).WithMany(p => p.Inverseduplicate_ofNavigation)
                .HasForeignKey(d => d.duplicate_of)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("fk_leads_duplicate_of");

            entity.HasOne(d => d.region).WithMany(p => p.leads)
                .HasForeignKey(d => d.region_id)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("fk_leads_region");

            entity.HasOne(d => d.source).WithMany(p => p.leads)
                .HasForeignKey(d => d.source_id)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("fk_leads_source");
        });

        modelBuilder.Entity<lead_activity>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PRIMARY");

            entity.UseCollation("utf8mb4_0900_ai_ci");

            entity.HasIndex(e => e.user_id, "fk_lead_activities_user");

            entity.HasIndex(e => new { e.lead_id, e.user_id }, "idx_lead_activities_lead_user");

            entity.Property(e => e.activity_type).HasMaxLength(100);
            entity.Property(e => e.created_at)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.outcome).HasMaxLength(255);

            entity.HasOne(d => d.lead).WithMany(p => p.lead_activities)
                .HasForeignKey(d => d.lead_id)
                .HasConstraintName("fk_lead_activities_lead");

            entity.HasOne(d => d.user).WithMany(p => p.lead_activities)
                .HasForeignKey(d => d.user_id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_lead_activities_user");
        });

        modelBuilder.Entity<lead_note>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PRIMARY");

            entity.UseCollation("utf8mb4_0900_ai_ci");

            entity.HasIndex(e => e.user_id, "fk_lead_notes_user");

            entity.HasIndex(e => new { e.lead_id, e.user_id }, "idx_lead_notes_lead_user");

            entity.Property(e => e.created_at)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.note).HasColumnType("text");

            entity.HasOne(d => d.lead).WithMany(p => p.lead_notes)
                .HasForeignKey(d => d.lead_id)
                .HasConstraintName("fk_lead_notes_lead");

            entity.HasOne(d => d.user).WithMany(p => p.lead_notes)
                .HasForeignKey(d => d.user_id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_lead_notes_user");
        });

        modelBuilder.Entity<region>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PRIMARY");

            entity.UseCollation("utf8mb4_0900_ai_ci");

            entity.HasIndex(e => e.code, "uq_regions_code").IsUnique();

            entity.Property(e => e.code).HasMaxLength(50);
            entity.Property(e => e.name).HasMaxLength(255);
        });

        modelBuilder.Entity<source>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PRIMARY");

            entity.UseCollation("utf8mb4_0900_ai_ci");

            entity.Property(e => e.channel).HasMaxLength(100);
            entity.Property(e => e.is_active).HasDefaultValueSql("'1'");
            entity.Property(e => e.name).HasMaxLength(255);
        });

        modelBuilder.Entity<team>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PRIMARY");

            entity.UseCollation("utf8mb4_0900_ai_ci");

            entity.HasIndex(e => e.center_id, "idx_teams_center_id");

            entity.Property(e => e.name).HasMaxLength(255);

            entity.HasOne(d => d.center).WithMany(p => p.teams)
                .HasForeignKey(d => d.center_id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_teams_center");
        });

        modelBuilder.Entity<user>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PRIMARY");

            entity.UseCollation("utf8mb4_0900_ai_ci");

            entity.HasIndex(e => e.region_id, "fk_users_region");

            entity.HasIndex(e => e.team_id, "fk_users_team");

            entity.HasIndex(e => new { e.role_id, e.team_id, e.region_id }, "idx_users_role_team_region");

            entity.Property(e => e.created_at)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.email).HasMaxLength(255);
            entity.Property(e => e.first_name).HasMaxLength(100);
            entity.Property(e => e.is_active).HasDefaultValueSql("'1'");
            entity.Property(e => e.last_name).HasMaxLength(100);
            entity.Property(e => e.phone).HasMaxLength(50);

            entity.HasOne(d => d.region).WithMany(p => p.users)
                .HasForeignKey(d => d.region_id)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("fk_users_region");

            entity.HasOne(d => d.role).WithMany(p => p.users)
                .HasForeignKey(d => d.role_id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_users_role");

            entity.HasOne(d => d.team).WithMany(p => p.users)
                .HasForeignKey(d => d.team_id)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("fk_users_team");
        });

        modelBuilder.Entity<user_role>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PRIMARY");

            entity.UseCollation("utf8mb4_0900_ai_ci");

            entity.HasIndex(e => e.name, "uq_user_roles_name").IsUnique();

            entity.Property(e => e.description).HasColumnType("text");
            entity.Property(e => e.name).HasMaxLength(100);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
