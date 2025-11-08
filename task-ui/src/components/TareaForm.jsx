// src/TareaForm.jsx
import React, { useState, useEffect } from "react";

const initialFormState = {
  titulo: "",
  descripcion: "",
  encargado: "",
  completada: false,
  imagenEncargado: null,
  fechaCreacion: new Date().toISOString(),
};

const TareaForm = ({ initialData = null, onSubmit, onCancel }) => {
  const initialImage =
    initialData &&
    initialData.imagenEncargado &&
    typeof initialData.imagenEncargado === "string"
      ? `data:image/jpeg;base64,${initialData.imagenEncargado}`
      : null;

  const [formData, setFormData] = useState(initialData || initialFormState);
  const [file, setFile] = useState(null); // Archivo para subir
  const [imagePreview, setImagePreview] = useState(initialImage); // URL de la imagen

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));

      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        setFormData((prevData) => ({
          ...prevData,
          imagenEncargado: base64String,
        }));
      };

      reader.readAsDataURL(selectedFile);
    } else {
      setFile(null);
      setImagePreview(null);
      setFormData((prevData) => ({ ...prevData, imagenEncargado: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      fechaCreacion: formData.fechaCreacion,
    };

    if (!initialData) {
      delete dataToSend.id;
    }

    onSubmit(dataToSend);
    if (!initialData) {
      setFormData(initialFormState);
      setFile(null);
      setImagePreview(null);
    }
  };

  return (
    <div className="form-container">
      <h3>{initialData ? "Editar Tarea" : "Añadir Nueva Tarea"}</h3>
      <form onSubmit={handleSubmit} className="swiss-form">
        <input
          name="titulo"
          value={formData.titulo || ""}
          onChange={handleChange}
          placeholder="Título"
          type="text"
          required
        />
        <textarea
          name="descripcion"
          value={formData.descripcion || ""}
          onChange={handleChange}
          placeholder="Descripción"
          rows="3"
          required
        />
        <input
          name="encargado"
          value={formData.encargado || ""}
          onChange={handleChange}
          placeholder="Encargado"
          type="text"
          required
        />

        {/* Campo para la Imagen */}
        <label className="file-label">
          Imagen del Encargado (Opcional):
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>

        {imagePreview && (
          <div style={{ marginBottom: "15px" }}>
            <p style={{ fontSize: "0.8em", color: "#666" }}>
              Previsualización:
            </p>
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </div>
        )}

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="completada"
            checked={formData.completada}
            onChange={handleChange}
          />
          Tarea Completada
        </label>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {initialData ? "Guardar Cambios" : "Crear Tarea"}
          </button>
          {initialData && (
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TareaForm;
