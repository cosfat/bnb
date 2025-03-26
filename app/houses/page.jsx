"use client";

import { useState } from "react";
import { useHouses, useCreateHouse, useUpdateHouse, useDeleteHouse } from "../hooks/useHouses";
import Navbar from "../components/Navbar";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import FormInput from "../components/FormInput";
import FormButton from "../components/FormButton";

export default function HousesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentHouse, setCurrentHouse] = useState(null);
  const [formData, setFormData] = useState({ name: "" });

  const { data: houses = [], isLoading, error } = useHouses();
  const createHouseMutation = useCreateHouse();
  const updateHouseMutation = useUpdateHouse();
  const deleteHouseMutation = useDeleteHouse();

  const handleOpenModal = (house = null) => {
    setCurrentHouse(house);
    setFormData({ name: house ? house.name : "" });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentHouse(null);
    setFormData({ name: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentHouse) {
      updateHouseMutation.mutate(
        {
          id: currentHouse.id,
          data: formData,
        },
        {
          onSuccess: () => {
            handleCloseModal();
          },
        }
      );
    } else {
      createHouseMutation.mutate(formData, {
        onSuccess: () => {
          handleCloseModal();
        },
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Bu evi silmek istediğinize emin misiniz?")) {
      deleteHouseMutation.mutate(id);
    }
  };

  const columns = [
    {
      key: "id",
      label: "ID",
    },
    {
      key: "name",
      label: "Ev Adı",
    },
    {
      key: "created_at",
      label: "Oluşturma Tarihi",
      render: (value) => new Date(value).toLocaleDateString("tr-TR"),
    },
  ];

  if (isLoading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error.message}</div>;

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Evler</h1>
          <FormButton 
            onClick={() => handleOpenModal()}
            variant="primary"
          >
            Yeni Ev Ekle
          </FormButton>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <DataTable
            columns={columns}
            data={houses}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
          />
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={currentHouse ? "Evi Düzenle" : "Yeni Ev Ekle"}
        >
          <form onSubmit={handleSubmit}>
            <FormInput
              label="Ev Adı"
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
                disabled={createHouseMutation.isPending || updateHouseMutation.isPending}
              >
                {createHouseMutation.isPending || updateHouseMutation.isPending
                  ? "Kaydediliyor..."
                  : currentHouse
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