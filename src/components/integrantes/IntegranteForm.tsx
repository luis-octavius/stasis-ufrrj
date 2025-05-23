// src/components/integrantes/IntegranteForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Member } from "../../lib/types"; // Adjust path as needed

interface IntegranteFormProps {
  initialData?: Partial<Member> | null; // Data for editing, or null/undefined for adding
  onSubmit: (formData: Omit<Member, "id">) => void;
  isSubmitting?: boolean; // Optional prop to disable form while submitting
}

export default function IntegranteForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: IntegranteFormProps) {
  const [formData, setFormData] = useState<Omit<Member, "id">>({
    name: initialData?.name || "",
    areaPesquisa: initialData?.areaPesquisa || "",
    instituicao: initialData?.instituicao || "",
    curriculoLattes: initialData?.curriculoLattes || "",
    imageUrl: initialData?.imageUrl || "",
  });

  // Effect to update form data if initialData changes (useful for editing)
  useEffect(() => {
    setFormData({
      name: initialData?.name || "",
      areaPesquisa: initialData?.areaPesquisa || "",
      instituicao: initialData?.instituicao || "",
      curriculoLattes: initialData?.curriculoLattes || "",
      imageUrl: initialData?.imageUrl || "",
    });
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Basic validation (name and instituicao are required)
    if (!formData.name || !formData.instituicao) {
      alert("Nome e Instituição são campos obrigatórios.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Nome <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label
          htmlFor="areaPesquisa"
          className="block text-sm font-medium text-gray-700"
        >
          Área de Pesquisa (Opcional)
        </label>
        <input
          type="text"
          id="areaPesquisa"
          name="areaPesquisa"
          value={formData.areaPesquisa}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label
          htmlFor="instituicao"
          className="block text-sm font-medium text-gray-700"
        >
          Instituição <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="instituicao"
          name="instituicao"
          value={formData.instituicao}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label
          htmlFor="curriculoLattes"
          className="block text-sm font-medium text-gray-700"
        >
          Currículo Lattes URL (Opcional)
        </label>
        <input
          type="url" // Use type="url" for better input validation
          id="curriculoLattes"
          name="curriculoLattes"
          value={formData.curriculoLattes}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label
          htmlFor="imageUrl"
          className="block text-sm font-medium text-gray-700"
        >
          Imagem URL (Opcional)
        </label>
        {/* Note: This is for URL input. File upload would require more logic */}
        <input
          type="url" // Use type="url" for image URL
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          disabled={isSubmitting}
        />
        {formData.imageUrl && (
          <div className="mt-2">
            <img
              src={formData.imageUrl}
              alt="Preview"
              className="max-h-32 object-cover rounded"
            />
          </div>
        )}
      </div>
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? "Salvando..."
            : initialData
              ? "Atualizar Integrante"
              : "Adicionar Integrante"}
        </button>
        {initialData && ( // Show cancel button only in edit mode
          <button
            type="button"
            onClick={() => onSubmit({} as any)} // Call onSubmit with empty data or a specific cancel handler
            disabled={isSubmitting}
            className="ml-4 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
