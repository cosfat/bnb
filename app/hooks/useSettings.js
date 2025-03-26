import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const fetchSettings = async () => {
  const response = await axios.get("/api/settings");
  console.log("API'den gelen ayarlar:", response.data);
  return response.data;
};

const updateSettings = async (data) => {
  const response = await axios.put("/api/settings", data);
  console.log("API'den gelen güncellenmiş ayarlar:", response.data);
  return response.data;
};

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
    staleTime: 0, // Her zaman yeni veri al
    cacheTime: 1000, // Önbellek süresini kısalt
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSettings,
    onSuccess: (data) => {
      console.log("Mutation başarılı, önbelleği güncelliyorum:", data);
      // Önbelleği doğrudan güncel veriyle güncelle
      queryClient.setQueryData(["settings"], data);
    },
  });
} 