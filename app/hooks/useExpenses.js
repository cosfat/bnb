import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const fetchExpenses = async () => {
  const userId = localStorage.getItem("userId");
  const response = await axios.get("/api/expenses", {
    headers: {
      "x-user-id": userId || ""
    }
  });
  return response.data;
};

const fetchExpense = async (id) => {
  const userId = localStorage.getItem("userId");
  const response = await axios.get(`/api/expenses/${id}`, {
    headers: {
      "x-user-id": userId || ""
    }
  });
  return response.data;
};

const createExpense = async (data) => {
  const userId = localStorage.getItem("userId");
  const response = await axios.post("/api/expenses", data, {
    headers: {
      "x-user-id": userId || ""
    }
  });
  return response.data;
};

const updateExpense = async ({ id, data }) => {
  const userId = localStorage.getItem("userId");
  const response = await axios.put(`/api/expenses/${id}`, data, {
    headers: {
      "x-user-id": userId || ""
    }
  });
  return response.data;
};

const deleteExpense = async (id) => {
  const userId = localStorage.getItem("userId");
  const response = await axios.delete(`/api/expenses/${id}`, {
    headers: {
      "x-user-id": userId || ""
    }
  });
  return response.data;
};

export function useExpenses() {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: fetchExpenses,
  });
}

export function useExpense(id) {
  return useQuery({
    queryKey: ["expenses", id],
    queryFn: () => fetchExpense(id),
    enabled: !!id,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateExpense,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenses", data.id] });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
} 