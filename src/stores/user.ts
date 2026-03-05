import { defineStore } from 'pinia';
import { AxiosResponse } from 'axios';
import apiClient from 'src/plugins/axios';
import { CreateUserPayload, User } from 'src/interfaces/users.interface';

interface UserState {
  users: User[] | null;
  profile: any;
  limit: number;
  offset: number;
  order: string;
  orderBy: string;
  totalPage: number | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    users: [],
    profile: {},
    limit: 10,
    offset: 0,
    order: 'ASC',
    orderBy: 'run',
    totalPage: null
  }),

  actions: {
    async getUsersPagination() {
      try {
        this.users = [];
        const response: AxiosResponse<{ data: { count: number, rows: User[] }, statusCode: number, send: string }> = await apiClient.post(
          '/users/pagination',
          {
            limit: this.limit,
            offset: this.offset,
            order: this.order,
            orderBy: this.orderBy
          }
        );

        const count = response.data.data.count;
        this.users = response.data.data.rows;
        this.totalPage = count / this.limit < 1 ? 1 : Math.ceil(count / this.limit);
      } catch (error) {
        console.log('Error en getUsersPagination', error);
      }
    },

    async getUsers() {
      try {
        const response: AxiosResponse<{ data: User[], statusCode: number, send: string }> = await apiClient.get(
          '/users'
        );

        console.log(response);
      } catch (error) {
        console.log('Error en getUsers', error);
      }
    },

    async createSuperUser(newUser: CreateUserPayload) {
      try {
        const response: AxiosResponse = await apiClient.post(
          '/users/superuser',
          newUser
        );

        console.log(response);
        return response;
      } catch (error) {
        console.log('Error en createSuperUser', error);
      }
    },

    async createAdminUser(newUser: CreateUserPayload) {
      try {
        const response: AxiosResponse = await apiClient.post(
          '/users/admin',
          newUser
        );

        console.log(response);
        return response;
      } catch (error) {
        console.log('Error en createAdminUser', error);
      }
    },

    async createOwner(newUser: any) {
      try {
        const response: AxiosResponse = await apiClient.post<{ data: { data: number; send: string; statusCode: number }}>(
          '/owners',
          newUser
        );

        if (response.data.statusCode === 201) {
          return response.data;
        }

      } catch (error) {
        console.log('Error en createOwner', error);
      }
    },

    async deleteOwner(id: number) {
      try {
        const response: AxiosResponse = await apiClient.delete<{ data: { data: number; send: string; statusCode: number } }>(
          `/owners/${id}`
        );

        return response.data;
      } catch (error) {
        console.log('Error en deleteOwner', error);
      }
    },

    async deleteOwnerCompany(id: number) {
      try {
        const response: AxiosResponse = await apiClient.delete<{ data: { data: number; send: string; statusCode: number } }>(
          `/company-owners/${id}`
        );

        return response.data;
      } catch (error) {
        console.log('Error en deleteOwnerCompany', error);
      }
    },

    async editOwner(owner: any, id: number) {
      try {
        const response: AxiosResponse = await apiClient.put<{ data: { data: number; send: string; statusCode: number }}>(
          `/owners/update/data/${id}`,
          owner
        );

        if (response.data.statusCode === 201) {
          return response.data;
        }

      } catch (error) {
        console.log('Error en createOwner', error);
      }
    },

    async getOwner(id: number) {
      try {
        const response: AxiosResponse<{ data: any, statusCode: number, send: string }> = await apiClient.get(
          `/owners/${id}`
        );

        return {
          ...response.data.data,
          phones: response.data.data.phones[0]
        };
      } catch (error) {
        console.log('Error en getUsers', error);
      }
    },

    async getProfile() {
      try {
        const response: AxiosResponse<{ data: any, statusCode: number, send: string }> = await apiClient.get(
          'users/profile'
        );

        this.profile = response.data.data;
      } catch (error) {
        console.log('Error en getUsers', error);
      }
    },

    async updateProfile(user: any) {
      try {
        const response: AxiosResponse = await apiClient.put<{ data: { data: number; send: string; statusCode: number }}>(
          '/users/update/data/header',
          user
        );

        if (response.data.statusCode === 201) {
          return response.data;
        }

      } catch (error) {
        console.log('Error en updateProfile', error);
      }
    },
  }
})
