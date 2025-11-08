// src/api.js
const API_URL = "http://localhost:5114/api/accion";

// --- HEADERS REQUERIDOS ---
const headers = {
  "Content-Type": "application/json",
  "Accept": "application/json",
};

// --- GET: Listar todas las tareas ---
export const getTareas = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Error al obtener las tareas.");
  }
  return response.json();
};

// --- POST: Crear una nueva tarea ---
export const createTarea = async (tarea) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(tarea),
  });
  if (!response.ok) {
    const errorData = await response.json();
    // Manejo de error de validación del backend
    throw new Error(errorData.title || "Error al crear la tarea."); 
  }
  return response.json();
};

// --- PUT: Actualizar una tarea existente ---
export const updateTarea = async (id, tarea) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(tarea),
  });
  if (response.status === 204) {
    return true; // 204 No Content, éxito.
  }
  if (!response.ok) {
    throw new Error("Error al actualizar la tarea.");
  }
  return response.json(); 
};

// --- DELETE: Borrar una tarea (Borrado Suave) ---
export const deleteTarea = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (response.status === 204) {
    return true; // 204 No Content, éxito.
  }
  if (!response.ok) {
    throw new Error("Error al eliminar la tarea.");
  }
};
