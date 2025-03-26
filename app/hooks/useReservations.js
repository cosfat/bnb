import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const fetchReservations = async () => {
  const userId = localStorage.getItem("userId");
  const response = await axios.get("/api/reservations", {
    headers: {
      "x-user-id": userId || ""
    }
  });
  return response.data;
};

const fetchReservation = async (id) => {
  const userId = localStorage.getItem("userId");
  const response = await axios.get(`/api/reservations/${id}`, {
    headers: {
      "x-user-id": userId || ""
    }
  });
  return response.data;
};

const createReservation = async (data) => {
  const userId = localStorage.getItem("userId");
  const response = await axios.post("/api/reservations", data, {
    headers: {
      "x-user-id": userId || ""
    }
  });
  return response.data;
};

const updateReservation = async ({ id, data }) => {
  const userId = localStorage.getItem("userId");
  const response = await axios.put(`/api/reservations/${id}`, data, {
    headers: {
      "x-user-id": userId || ""
    }
  });
  return response.data;
};

const deleteReservation = async (id) => {
  const userId = localStorage.getItem("userId");
  const response = await axios.delete(`/api/reservations/${id}`, {
    headers: {
      "x-user-id": userId || ""
    }
  });
  return response.data;
};

export function useReservations() {
  return useQuery({
    queryKey: ["reservations"],
    queryFn: fetchReservations,
  });
}

export function useReservation(id) {
  return useQuery({
    queryKey: ["reservations", id],
    queryFn: () => fetchReservation(id),
    enabled: !!id,
  });
}

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
}

export function useUpdateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateReservation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["reservations", data.id] });
    },
  });
}

export function useDeleteReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
} 