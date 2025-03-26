import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const fetchCategories = async () => {
  const response = await axios.get("/api/categories");
  return response.data;
};

const fetchCategory = async (id) => {
  const response = await axios.get(`/api/categories/${id}`);
  return response.data;
};

const createCategory = async (data) => {
  const response = await axios.post("/api/categories", data);
  return response.data;
};

const updateCategory = async ({ id, data }) => {
  const response = await axios.put(`/api/categories/${id}`, data);
  return response.data;
};

const deleteCategory = async (id) => {
  const response = await axios.delete(`/api/categories/${id}`);
  return response.data;
};

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
}

export function useCategory(id) {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: () => fetchCategory(id),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories", data.id] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
} 