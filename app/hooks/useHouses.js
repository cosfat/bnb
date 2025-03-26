import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const fetchHouses = async () => {
  const response = await axios.get("/api/houses");
  return response.data;
};

const fetchHouse = async (id) => {
  const response = await axios.get(`/api/houses/${id}`);
  return response.data;
};

const createHouse = async (data) => {
  const response = await axios.post("/api/houses", data);
  return response.data;
};

const updateHouse = async ({ id, data }) => {
  const response = await axios.put(`/api/houses/${id}`, data);
  return response.data;
};

const deleteHouse = async (id) => {
  const response = await axios.delete(`/api/houses/${id}`);
  return response.data;
};

export function useHouses() {
  return useQuery({
    queryKey: ["houses"],
    queryFn: fetchHouses,
  });
}

export function useHouse(id) {
  return useQuery({
    queryKey: ["houses", id],
    queryFn: () => fetchHouse(id),
    enabled: !!id,
  });
}

export function useCreateHouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHouse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["houses"] });
    },
  });
}

export function useUpdateHouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateHouse,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["houses"] });
      queryClient.invalidateQueries({ queryKey: ["houses", data.id] });
    },
  });
}

export function useDeleteHouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteHouse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["houses"] });
    },
  });
} 