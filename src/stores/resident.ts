import { defineStore } from 'pinia';

import { AxiosResponse } from 'axios';
import apiClient from 'src/plugins/axios';
import { globalMixin } from 'src/mixins/globalMixin';
import { NewResident } from 'src/interfaces/residents.interface';

interface ResidentState {
  residents: [] | null;
}

export const useResidentStore = defineStore('resident', {
  state: (): ResidentState => ({
    residents: []
  }),

  actions: {
    async getResidentsForCompany(state: string = 'active') {
      const companyId = globalMixin.methods.getIdCompany()

      try {
        const response: AxiosResponse = await apiClient.get(
          `/${process.env.CONTEXT_API_PRIVATE}/residents?companyId=${companyId}&state=${state}`
        )

        this.residents = response.data.residents;
      } catch (error) {
        console.log('Error en getResidentsForCompany', error);

      }
    },

    async getResidentById(id: number) {
      try {
        const response: AxiosResponse = await apiClient.get(
          `/${process.env.CONTEXT_API_PRIVATE}/residents/${id}`
        )

        return response.data.resident;
      } catch (error) {
        console.log('Error en getResidentById', error);

      }
    },

    async createResident(resident: NewResident) {
      const companyId = globalMixin.methods.getIdCompany()

      try {
        const formData = new FormData();

        const residentData = { ...resident ,companyId, photo: null };
        formData.append('data', JSON.stringify(residentData));

        if (resident.photo) {
          const blob = globalMixin.methods.dataURLtoBlob(resident.photo);
          formData.append('photo', blob, 'photo.jpg');
        }

        const response: AxiosResponse = await apiClient.post(
          `/${process.env.CONTEXT_API_PRIVATE}/residents`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }

        );

        return response.data;
      } catch (error) {
        console.log('Error en createResident', error);

      }
    },

    async retirementResident(idResident: number, date: string, reason: string) {
      try {
        const response: AxiosResponse = await apiClient.put(
          `/${process.env.CONTEXT_API_PRIVATE}/residents/retirement/${idResident}`,
          { date, reason }
        );

        return response.data;
      } catch (error) {
        console.log('Error en retirementResident', error);

      }
    },

    async editResident(idResident: number, resident: NewResident) {
      const companyId = globalMixin.methods.getIdCompany()
      try {
        const formData = new FormData();
        const residentData = {
          ...resident,
          companyId,
          photo: resident.photo?.includes('https') ? resident.photo : null
        };
        formData.append('data', JSON.stringify(residentData));

        if (resident.photo && !resident.photo.includes('https')) {
          const blob = globalMixin.methods.dataURLtoBlob(resident.photo);

          const mimeType = blob.type;
          const extension = mimeType.split('/')[1];

          console.log(extension);

          const filename = `photo_profile.${extension}`;

          formData.append('photo', blob, filename);
        }

        const response: AxiosResponse = await apiClient.put(
          `/${process.env.CONTEXT_API_PRIVATE}/residents/${idResident}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        return response.data;
      } catch (error) {
        console.log('Error en retirementResident', error);

      }
    }
  }
})
