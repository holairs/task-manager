using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.Data;
using TaskManager.Models;

[Route("api/accion")] // Ruta: /api/tarea
[ApiController]
public class TareaController : ControllerBase
{
    private readonly AppDbContext _context;

    public TareaController(AppDbContext context)
    {
        _context = context;
    }

    // ___ GET: /api/tarea (Ver todos)
    [HttpGet]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Tarea>>> GetTareas()
    {
        return await _context.Tareas.ToListAsync();
    }
    

    // ___ GET: /api/tarea/5 (Ver por ID detalles)
    [HttpGet("{id}")]
    public async Task<ActionResult<Tarea>> GetTarea(int id)
    {
        var tarea = await _context.Tareas.FindAsync(id);

        if (tarea == null)
        {
            return NotFound();
        }

        return tarea; // Aquí sí se envía la imagen
    }

    // ___ POST: /api/tarea (Crear uno nuevo)
    [HttpPost]
    public async Task<ActionResult<Tarea>> PostTarea(Tarea tarea)
    {
        // Validación básica
        if (string.IsNullOrEmpty(tarea.Titulo))
        {
            return BadRequest("El título es obligatorio.");
        }

        _context.Tareas.Add(tarea);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTarea), new { id = tarea.Id }, tarea);
    }

    // ___ PUT: /api/tarea/5 (Modificar por ID)
    [HttpPut("{id}")]
    public async Task<IActionResult> PutTarea(int id, Tarea tarea)
    {
        if (id != tarea.Id)
        {
            return BadRequest();
        }

        // Marcar la entidad como modificada
        _context.Entry(tarea).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Tareas.Any(e => e.Id == id))
            {
                return NotFound();
            }

            throw;
        }

        return NoContent(); // 204 No Content
    }

    // ___ DELETE: /api/tarea/5 (Borrar por ID con Borrado Suave)
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTarea(int id)
    {
        var tarea = await _context.Tareas.FindAsync(id);
        if (tarea == null)
        {
            return NotFound();
        }

        // 1. Crear el registro en la tabla de archivados (Borrado Suave)
        var tareaArchivada = new TareaArchivada
        {
            TareaIdOriginal = tarea.Id,
            Titulo = tarea.Titulo,
            FechaBorrado = DateTime.Now,
            // Guardar el contenido completo como JSON serializado
            ContenidoJSON = System.Text.Json.JsonSerializer.Serialize(tarea)
        };

        _context.TareasArchivadas.Add(tareaArchivada);

        // 2. Eliminar el registro de la tabla principal
        _context.Tareas.Remove(tarea);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}