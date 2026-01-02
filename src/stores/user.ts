import { defineStore } from 'pinia';
import { AxiosResponse } from 'axios';
import apiClient from 'src/plugins/axios';

interface UserState {
  users: any[] | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    users: null
  }),

  actions: {
    async getUsersPagination() {

    },

    async getUsers() {
      try {
        const response: AxiosResponse = await apiClient.get(
          '/users'
        );

        console.log(response);
      } catch (error) {
        console.log('Error en getUsers', error);
      }
    }
  }
})
