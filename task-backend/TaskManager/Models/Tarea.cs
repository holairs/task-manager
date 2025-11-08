    // Models/Tarea.cs
    using System.ComponentModel.DataAnnotations;

    namespace TaskManager.Models
    {
        public class Tarea
        {
            public int Id { get; set; }

            [Required]
            public string Titulo { get; set; } = string.Empty;

            [Required]
            public string Descripcion { get; set; } = string.Empty;

            [Required]
            public string Encargado { get; set; } = string.Empty;
            
            // Propiedad para almacenar la imagen como un arreglo de bytes (BLOB)
            public byte[]? ImagenEncargado { get; set; }
            
            public DateTime FechaCreacion { get; set; } = DateTime.Now;
            public bool Completada { get; set; } = false;
        }
    }