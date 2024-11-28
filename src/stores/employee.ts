import { defineStore } from 'pinia';
import { AxiosResponse } from 'axios';

import apiClient from 'src/plugins/axios';
import { Employee, NewEmployee } from 'src/interfaces/employees.interface';
import { globalMixin } from 'src/mixins/globalMixin';

interface EmployeeState {
  employees: Employee[] | null;
}

export const useEmployeeStore = defineStore('employee', {
  state: (): EmployeeState => ({
    employees: null
  }),

  getters: {

  },

  actions: {
    async getEmployees(page: number = 1, limit: number = 10, rut?: string, name?: string) {
      try {
        const companyId = globalMixin.methods.getIdCompany();
        const params: any = {
          companyId,
          page,
          limit
        };

        if (rut) {
          params.rut = rut;
        }

        if (name) {
          params.name = name;
        }

        console.log(params);
        const response: AxiosResponse = await apiClient.get(
          `/${process.env.CONTEXT_API_PRIVATE}/employees`,
          { params }
        );

        this.employees = response.data.employees;
      } catch (error) {
        console.log('Error en getEmployees', error);
      }
    },

    async createEmployee(newEmployee: NewEmployee) {
      try {

        const companyId = globalMixin.methods.getIdCompany();

        const body = {
          ...newEmployee,
          companyId
        };

        const response: AxiosResponse = await apiClient.post(
          `/${process.env.CONTEXT_API_PRIVATE}/employees`,
          body
        );

        return response.data;

      } catch (error) {
        console.log('Error en createEmployee', error);
      }
    },

    async deleteEmployee(employeeId: number | undefined) {
      try {
        const response: AxiosResponse = await apiClient.delete(
          `/${process.env.CONTEXT_API_PRIVATE}/employees/${employeeId}`,
        );

        return response.data;
      } catch (error) {
        console.log('Error en deleteEmployee', error);
      }
    },

    async editEmployee(employeeEdit: NewEmployee, employeeId: number) {
      try {
        const response: AxiosResponse = await apiClient.put(
          `/${process.env.CONTEXT_API_PRIVATE}/employees/${employeeId}`,
          { ...employeeEdit }
        );

        return response.data;
      } catch (error) {
        console.log('Error en editEmployee', error);
      }
    }
  }
})
