import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const fetchWorkers = async () => {
  const response = await axios.get("/api/workers");
  return response.data;
};

const fetchWorker = async (id) => {
  const response = await axios.get(`/api/workers/${id}`);
  return response.data;
};

const createWorker = async (data) => {
  const response = await axios.post("/api/workers", data);
  return response.data;
};

const updateWorker = async ({ id, data }) => {
  const response = await axios.put(`/api/workers/${id}`, data);
  return response.data;
};

const deleteWorker = async (id) => {
  const response = await axios.delete(`/api/workers/${id}`);
  return response.data;
};

export function useWorkers() {
  return useQuery({
    queryKey: ["workers"],
    queryFn: fetchWorkers,
  });
}

export function useWorker(id) {
  return useQuery({
    queryKey: ["workers", id],
    queryFn: () => fetchWorker(id),
    enabled: !!id,
  });
}

export function useCreateWorker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWorker,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workers"] });
    },
  });
}

export function useUpdateWorker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateWorker,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workers"] });
    },
  });
}

export function useDeleteWorker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWorker,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workers"] });
    },
  });
} 