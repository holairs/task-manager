using Microsoft.EntityFrameworkCore;
using TaskManager.Models; 

namespace TaskManager.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Tarea> Tareas { get; set; }
        public DbSet<TareaArchivada> TareasArchivadas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // --- Configuración de Tarea ---
            modelBuilder.Entity<Tarea>(entity =>
            {
                // Mapeo para la imagen (BLOB/LONGBLOB)
                entity.Property(t => t.ImagenEncargado)
                    .HasColumnType("LONGBLOB"); 

                // Título (Obligatorio y longitud máxima)
                entity.Property(t => t.Titulo)
                    .IsRequired() 
                    .HasMaxLength(100);

                // Descripción (Obligatorio)
                entity.Property(t => t.Descripcion)
                    .IsRequired(); 

                // Encargado (Obligatorio)
                entity.Property(t => t.Encargado)
                    .IsRequired();
            });
            // Opcional: Agregar configuraciones para TareaArchivada si las hay
        }
    }
}