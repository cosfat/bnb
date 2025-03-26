"use client";

import { useState } from "react";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "../hooks/useCategories";
import Navbar from "../components/Navbar";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import FormInput from "../components/FormInput";
import FormButton from "../components/FormButton";

export default function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "" });

  const { data: categories = [], isLoading, error } = useCategories();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const handleOpenModal = (category = null) => {
    setCurrentCategory(category);
    setFormData({ name: category ? category.name : "" });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCategory(null);
    setFormData({ name: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentCategory) {
      updateCategoryMutation.mutate(
        {
          id: currentCategory.id,
          data: formData,
        },
        {
          onSuccess: () => {
            handleCloseModal();
          },
        }
      );
    } else {
      createCategoryMutation.mutate(formData, {
        onSuccess: () => {
          handleCloseModal();
        },
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) {
      deleteCategoryMutation.mutate(id);
    }
  };

  const columns = [
    {
      key: "id",
      label: "ID",
    },
    {
      key: "name",
      label: "Kategori Adı",
    },
    {
      key: "created_at",
      label: "Oluşturma Tarihi",
      render: (value) => value ? new Date(value).toLocaleDateString("tr-TR") : "-",
    },
  ];

  if (isLoading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error.message}</div>;

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Kategoriler</h1>
          <FormButton 
            onClick={() => handleOpenModal()}
            variant="primary"
          >
            Yeni Kategori Ekle
          </FormButton>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <DataTable
            columns={columns}
            data={categories}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
          />
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={currentCategory ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}
        >
          <form onSubmit={handleSubmit}>
            <FormInput
              label="Kategori Adı"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />

            <div className="mt-6 flex justify-end space-x-3">
              <FormButton 
                onClick={handleCloseModal} 
                variant="secondary"
              >
                İptal
              </FormButton>
              <FormButton 
                type="submit" 
                variant="primary"
                disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
              >
                {createCategoryMutation.isPending || updateCategoryMutation.isPending
                  ? "Kaydediliyor..."
                  : currentCategory
                  ? "Güncelle"
                  : "Kaydet"}
              </FormButton>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
} 