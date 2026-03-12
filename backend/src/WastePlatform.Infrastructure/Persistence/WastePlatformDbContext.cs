using Microsoft.EntityFrameworkCore;
using WastePlatform.Domain.Entities;
using WastePlatform.Domain.Enums;

namespace WastePlatform.Infrastructure.Persistence;

public class WastePlatformDbContext : DbContext
{
    public WastePlatformDbContext(DbContextOptions<WastePlatformDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Enterprise> Enterprises { get; set; } = null!;
    public DbSet<WasteCategory> WasteCategories { get; set; } = null!;
    public DbSet<Collector> Collectors { get; set; } = null!;
    public DbSet<EnterpriseWasteType> EnterpriseWasteTypes { get; set; } = null!;
    public DbSet<WasteReport> WasteReports { get; set; } = null!;
    public DbSet<ReportImage> ReportImages { get; set; } = null!;
    public DbSet<CollectionTask> CollectionTasks { get; set; } = null!;
    public DbSet<TaskStatusLog> TaskStatusLogs { get; set; } = null!;
    public DbSet<CollectionImage> CollectionImages { get; set; } = null!;
    public DbSet<RewardRule> RewardRules { get; set; } = null!;
    public DbSet<RewardPoints> RewardPoints { get; set; } = null!;
    public DbSet<Complaint> Complaints { get; set; } = null!;
    public DbSet<AuditLog> AuditLogs { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Users
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(255);
            entity.Property(e => e.FullName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Phone).HasMaxLength(15);
            entity.Property(e => e.District).HasMaxLength(100);
            entity.Property(e => e.Ward).HasMaxLength(100);
            entity.Property(e => e.Role).HasConversion<string>();
            
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.Phone).IsUnique();
            entity.HasIndex(e => new { e.District, e.Ward });
            entity.HasIndex(e => e.Role);
        });

        // Configure Enterprises
        modelBuilder.Entity<Enterprise>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CompanyName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.ServiceArea).HasMaxLength(500);
            
            entity.HasOne(e => e.User)
                .WithOne(u => u.Enterprise)
                .HasForeignKey<Enterprise>(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => e.UserId).IsUnique();
        });

        // Configure WasteCategories
        modelBuilder.Entity<WasteCategory>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(50);
            entity.HasIndex(e => e.Name).IsUnique();
        });

        // Configure Collectors
        modelBuilder.Entity<Collector>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.HasOne(e => e.User)
                .WithOne(u => u.Collector)
                .HasForeignKey<Collector>(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Enterprise)
                .WithMany(en => en.Collectors)
                .HasForeignKey(e => e.EnterpriseId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => e.UserId).IsUnique();
        });

        // Configure EnterpriseWasteTypes
        modelBuilder.Entity<EnterpriseWasteType>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.HasOne(e => e.Enterprise)
                .WithMany(en => en.WasteTypes)
                .HasForeignKey(e => e.EnterpriseId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.WasteCategory)
                .WithMany(wc => wc.EnterpriseWasteTypes)
                .HasForeignKey(e => e.WasteCategoryId);

            entity.HasIndex(e => new { e.EnterpriseId, e.WasteCategoryId }).IsUnique();
        });

        // Configure WasteReports
        modelBuilder.Entity<WasteReport>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.Latitude).HasPrecision(10, 8);
            entity.Property(e => e.Longitude).HasPrecision(11, 8);
            entity.Property(e => e.Address).HasMaxLength(500);
            entity.Property(e => e.AiSuggestion).HasMaxLength(50);
            entity.Property(e => e.Status).HasConversion<string>();
            
            entity.HasOne(e => e.Citizen)
                .WithMany(u => u.WasteReports)
                .HasForeignKey(e => e.CitizenId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.WasteCategory)
                .WithMany(wc => wc.WasteReports)
                .HasForeignKey(e => e.WasteCategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => e.CitizenId);
            entity.HasIndex(e => e.WasteCategoryId);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => new { e.Latitude, e.Longitude });
            entity.HasIndex(e => e.CreatedAt);
        });

        // Configure ReportImages
        modelBuilder.Entity<ReportImage>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ImageUrl).IsRequired().HasMaxLength(500);
            
            entity.HasOne(e => e.WasteReport)
                .WithMany(r => r.Images)
                .HasForeignKey(e => e.ReportId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure CollectionTasks
        modelBuilder.Entity<CollectionTask>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Notes).HasMaxLength(500);
            entity.Property(e => e.CollectedWeightKg).HasPrecision(8, 2);
            entity.Property(e => e.Status).HasConversion<string>();
            
            entity.HasOne(e => e.WasteReport)
                .WithOne(r => r.CollectionTask)
                .HasForeignKey<CollectionTask>(e => e.ReportId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Enterprise)
                .WithMany(en => en.CollectionTasks)
                .HasForeignKey(e => e.EnterpriseId);

            entity.HasOne(e => e.Collector)
                .WithMany(c => c.CollectionTasks)
                .HasForeignKey(e => e.CollectorId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => e.ReportId).IsUnique();
            entity.HasIndex(e => e.EnterpriseId);
            entity.HasIndex(e => e.CollectorId);
            entity.HasIndex(e => e.Status);
        });

        // Configure TaskStatusLogs
        modelBuilder.Entity<TaskStatusLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Status).HasConversion<string>();
            
            entity.HasOne(e => e.CollectionTask)
                .WithMany(t => t.StatusLogs)
                .HasForeignKey(e => e.TaskId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => e.TaskId);
        });

        // Configure CollectionImages
        modelBuilder.Entity<CollectionImage>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ImageUrl).IsRequired().HasMaxLength(500);
            
            entity.HasOne(e => e.CollectionTask)
                .WithMany(t => t.Images)
                .HasForeignKey(e => e.TaskId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure RewardRules
        modelBuilder.Entity<RewardRule>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.HasOne(e => e.Enterprise)
                .WithMany(en => en.RewardRules)
                .HasForeignKey(e => e.EnterpriseId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.WasteCategory)
                .WithMany(wc => wc.RewardRules)
                .HasForeignKey(e => e.WasteCategoryId);

            entity.HasIndex(e => new { e.EnterpriseId, e.WasteCategoryId }).IsUnique();
        });

        // Configure RewardPoints
        modelBuilder.Entity<RewardPoints>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.IdempotencyKey).HasMaxLength(100);
            entity.Property(e => e.Reason).HasMaxLength(255);
            
            entity.HasOne(e => e.Citizen)
                .WithMany(u => u.RewardPoints)
                .HasForeignKey(e => e.CitizenId);

            entity.HasOne(e => e.WasteReport)
                .WithMany(r => r.RewardPoints)
                .HasForeignKey(e => e.ReportId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasIndex(e => e.IdempotencyKey).IsUnique();
            entity.HasIndex(e => new { e.CitizenId, e.CreatedAt });
        });

        // Configure Complaints
        modelBuilder.Entity<Complaint>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Content).HasMaxLength(2000);
            entity.Property(e => e.AdminResponse).HasMaxLength(2000);
            entity.Property(e => e.Status).HasConversion<string>();
            
            entity.HasOne(e => e.Citizen)
                .WithMany(u => u.Complaints)
                .HasForeignKey(e => e.CitizenId);

            entity.HasOne(e => e.WasteReport)
                .WithMany(r => r.Complaints)
                .HasForeignKey(e => e.ReportId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasIndex(e => e.CitizenId);
            entity.HasIndex(e => e.Status);
        });

        // Configure AuditLogs
        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Action).IsRequired().HasMaxLength(100);
            entity.Property(e => e.EntityType).HasMaxLength(50);
            entity.Property(e => e.IpAddress).HasMaxLength(45);
            
            entity.HasOne(e => e.User)
                .WithMany(u => u.AuditLogs)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasIndex(e => new { e.UserId, e.CreatedAt });
            entity.HasIndex(e => new { e.EntityType, e.EntityId });
        });
    }
}
