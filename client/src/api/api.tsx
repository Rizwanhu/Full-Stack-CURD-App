import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string;
  cookingTime: number;
}

export const register = (name: string, email: string, password: string) =>
  api.post('/auth/register', { name, email, password });

export const login = async (email: string, password: string) => {
  try {
    console.log('Attempting login with:', { email });
    const response = await api.post('/auth/login', { email, password });
    console.log('Login response:', response.data);
    
    if (!response.data.token) {
      throw new Error('No token received from server');
    }
    
    return response;
  } catch (error: any) {
    console.error('Login API error:', error.response?.data || error.message);
    throw error;
  }
};

export const getRecipes = () => api.get('/recipes');

export const createRecipe = async (recipe: Recipe) => {
  try {
    console.log('Creating recipe with data:', recipe);
    const response = await api.post('/recipes', recipe);
    return response;
  } catch (error: any) {
    console.error('Create recipe error:', {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

export const updateRecipe = async (id: string, recipe: Recipe) => {
  try {
    console.log('Updating recipe with data:', recipe);
    const response = await api.put(`/recipes/${id}`, recipe);
    return response;
  } catch (error: any) {
    console.error('Update recipe error:', {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

export const deleteRecipe = (id: string) => api.delete(`/recipes/${id}`);

export const getPaginatedRecipes = (page: number = 1, limit: number = 10) =>
  api.get(`/recipes/paginated?page=${page}&limit=${limit}`);

export default api;

