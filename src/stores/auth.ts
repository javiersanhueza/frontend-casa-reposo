import { defineStore } from 'pinia';
import { AxiosResponse } from 'axios';

import apiClient from 'src/plugins/axios';
import {
  LoginResponse,
  UserLogin,
  RegisterResponse, DefaultResponse
} from 'src/interfaces/auth/auth.interfaces';
import { Notify } from 'quasar';

export interface AuthState {
  token: string | null,
  user: UserLogin | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    user: null
  }),
  getters: {
    isAuthenticated: (state: AuthState) => !!state.token
  },
  actions: {
    async login(email: string, password: string) {
      try {
        const response: AxiosResponse<LoginResponse> = await apiClient.post(
          `/${process.env.CONTEXT_API_AUTH}/login`,
          { email, password }
        );
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        this.token = response.data.token;
        this.user = response.data.user;
      } catch (error) {
        console.log('Error en el login:', error);
      }
    },

    async register(name: string, email: string, password: string) {
      try {
        const response: AxiosResponse<RegisterResponse> = await apiClient.post(
          `/${process.env.CONTEXT_API_AUTH}/register`,
          { name, email, password }
        );
        return response.data;
      } catch (error) {
        console.log('Error en register:', error);
      }
    },

    async forgotPassword(email: string) {
      try {
        const response: AxiosResponse<DefaultResponse> = await apiClient.post(
          `/${process.env.CONTEXT_API_AUTH}/forgot-password`,
          { email }
        );
        Notify.create({
          type: 'positive',
          message: response.data.message,
          position: 'top',
          timeout: 3000
        });
      } catch (error) {
        console.log('Error en forgotPassword:', error);
      }
    },

    async restePassword(password: string, token: string) {
      try {
        const response: AxiosResponse<DefaultResponse> = await apiClient.post(
          `/${process.env.CONTEXT_API_AUTH}/reset-password/${token}`,
          { password }
        );
        Notify.create({
          type: 'positive',
          message: response.data.message,
          position: 'top',
          timeout: 3000
        });

        return true;
      } catch (error) {
        console.log('Error en restePassword:', error);
      }
    }
  }
})
