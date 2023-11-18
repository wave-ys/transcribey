using Microsoft.EntityFrameworkCore;
using Transcribey.Models;

namespace Transcribey.Data;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<Workspace> Workspaces { get; set; } = null!;
}