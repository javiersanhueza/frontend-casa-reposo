import axios from 'axios';
import { Loading, Notify } from 'quasar';

const apiClient = axios.create({
  baseURL: process.env.APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token al header si está en el localStorage
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  Loading.show({
    message: 'Cargando...'
  });
  return config;
}, error => {
  Loading.hide();
  return Promise.reject(error);
});

// Interceptor para manejar errores y ocultar el loading después de cada respuesta
apiClient.interceptors.response.use(
  response => {
    Loading.hide();
    return response;
  },
  error => {
    Loading.hide();

    if (error.response && error.response.status === 401) {
      // Token no válido o expirado
      localStorage.clear();
      window.location.href = '/';
    }

    Notify.create({
      type: 'negative',
      message: `${error.response?.data?.message} ${error.response.data.error ? `- ${error.response.data.error}` : ''}` || 'Error desconocido',
      position: 'top',
      timeout: 3000
    });

    return Promise.reject(error);
  }
);

export default apiClient;

