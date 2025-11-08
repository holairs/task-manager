// Models/TareaArchivada.cs
namespace TaskManager.Models
{
    public class TareaArchivada
    {
        public int Id { get; set; }
        // Se puede almacenar el JSON serializado de la tarea original o solo los campos clave
        public int TareaIdOriginal { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public DateTime FechaBorrado { get; set; } = DateTime.Now;
        // Opcional: El contenido completo de la tarea borrada
        public string ContenidoJSON { get; set; } = string.Empty;
    }
}