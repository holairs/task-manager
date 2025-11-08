// src/App.jsx

import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import TareaForm from "./components/TareaForm";
import { getTareas, createTarea, updateTarea, deleteTarea } from "./api";

const arrayBufferToImageUrl = (base64String) => {
  if (
    !base64String ||
    typeof base64String !== "string" ||
    base64String.length < 50
  )
    return null;
  return `data:image/jpeg;base64,${base64String}`;
};

function App() {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTarea, setEditingTarea] = useState(null);
  // Estado para las pestañas: 'explore' (predeterminado) o 'add'
  const [view, setView] = useState("explore");

  const fetchTareas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTareas();
      setTareas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTareas();
  }, [fetchTareas]);

  // --- MANEJADORES CRUD ---

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingTarea) {
        // Edición
        await updateTarea(editingTarea.id, formData);
        setEditingTarea(null); // Sale del modo edición
      } else {
        // Creación
        await createTarea(formData);
        setView("explore"); // Cambia a la vista de exploración después de crear
      }
      fetchTareas(); // Recarga la lista
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Confirmar borrado suave (archivado) de la tarea?")) {
      try {
        await deleteTarea(id);
        fetchTareas();
      } catch (err) {
        alert(`Error al eliminar: ${err.message}`);
      }
    }
  };

  // Activa el modo edición y cambia a la vista de Añadir/Editar
  const handleEditClick = (tarea) => {
    setEditingTarea(tarea);
    setView("add"); // Cambia la vista para mostrar el formulario
    window.scrollTo(0, 0); // Desplazar al inicio
  };

  // Cancela la edición
  const handleCancelEdit = () => {
    setEditingTarea(null);
    setView("explore");
  };

  // Cambia la vista y gestiona el estado de edición
  const handleViewChange = (newView) => {
    setView(newView);
    if (newView === "explore") {
      setEditingTarea(null); // Desactiva edición al ver la lista
    }
  };

  if (loading) return <div className="loading">Cargando tareas...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="container">
      <header>
        <h1>Task Manager</h1>
      </header>

      {/* Control de Segmentos (Tabs Unidos) */}
      <div className="segment-control">
        <button
          className={`segment-button ${view === "add" ? "active" : ""}`}
          onClick={() => handleViewChange("add")}
        >
          {editingTarea ? "Editar Tarea" : "Añadir Nueva"}
        </button>
        <button
          className={`segment-button ${view === "explore" ? "active" : ""}`}
          onClick={() => handleViewChange("explore")}
        >
          Explorar ({tareas.length})
        </button>
      </div>

      {/* --- RENDERIZADO DE VISTAS --- */}

      {/* Vista de Añadir/Editar */}
      {(view === "add" || editingTarea) && (
        <TareaForm
          initialData={editingTarea}
          onSubmit={handleCreateOrUpdate}
          onCancel={handleCancelEdit}
        />
      )}

      {/* Vista de Explorar */}
      {view === "explore" && !editingTarea && (
        <section className="tarea-list-section">
          <h2>Tareas</h2>
          <div className="tarea-list-grid">
            {tareas.length === 0 && (
              <p className="empty-message">
                No hay tareas creadas. Añade una nueva.
              </p>
            )}
            {tareas.map((tarea) => {
              // Generar la URL Base64 para la imagen
              const imageUrl = arrayBufferToImageUrl(tarea.imagenEncargado);

              return (
                <div
                  key={tarea.id}
                  className={`tarea-card ${tarea.completada ? "completed" : "pending"}`}
                >
                  <div className="card-header">
                    <h3 className="card-title">{tarea.titulo}</h3>
                    <span
                      className={`status-indicator ${tarea.completada ? "completed" : "pending"}`}
                    >
                      {tarea.completada ? "Completada" : "Pendiente"}
                    </span>
                  </div>

                  <div className="card-body">
                    {/* Renderizado de la imagen si existe */}
                    {imageUrl && (
                      <div className="card-image-container">
                        <img
                          src={imageUrl}
                          alt={`Encargado: ${tarea.encargado}`}
                        />
                      </div>
                    )}

                    <p>
                      {tarea.descripcion.substring(0, 100)}
                      {tarea.descripcion.length > 100 ? "..." : ""}
                    </p>

                    <div className="card-meta">
                      <span>
                        Encargado: <strong>{tarea.encargado}</strong>
                      </span>
                      <span>
                        Fecha:{" "}
                        {new Date(tarea.fechaCreacion).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button
                      onClick={() => handleEditClick(tarea)}
                      className="btn-edit"
                    >
                      Modificar
                    </button>
                    <button
                      onClick={() => handleDelete(tarea.id)}
                      className="btn-delete"
                    >
                      Archivar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
