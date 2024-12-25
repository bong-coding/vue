// src/hooks/useFetch.js
import { ref, onMounted, watch } from "vue";
import api from "../services/api";

export function useFetch(endpoint, params = {}) {
  const data = ref(null);
  const error = ref(null);
  const loading = ref(false);

  const fetchData = async () => {
    loading.value = true;
    try {
      const response = await api.get(endpoint, { params });
      data.value = response.data;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetchData);

  watch(
    () => params,
    () => {
      fetchData();
    },
    { deep: true }
  );

  return { data, error, loading };
}
