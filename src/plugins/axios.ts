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

// Interceptor para mostrar el loading antes de cada solicitud
apiClient.interceptors.request.use(config => {

  return config;
}, error => {
  Loading.hide();
  return Promise.reject(error);
})

// Interceptor para manejar errores y ocultar el loading después de cada respuesta
apiClient.interceptors.response.use(
  response => {
    Loading.hide();
    return response;
  },
  error => {
    Loading.hide();
    console.log(error);
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Error desconocido',
      position: 'top',
      timeout: 3000
    });

    return Promise.reject(error);
  }
)

export default apiClient;
