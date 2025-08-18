import { defineStore } from 'pinia';

import { AxiosResponse } from 'axios';
import apiClient from 'src/plugins/axios';

interface fileAttachment {
  file: object | null;
  files: [] | null;
}

export const useFileAttachmentStore = defineStore('fileAttachment', {
  state: (): fileAttachment => ({
    file: {},
    files: []
  }),

  actions: {
    async uploadFile(file: any): Promise<any> {
      try {
        return await apiClient.post(
          `/${process.env.CONTEXT_API_PRIVATE}/file-attachment`,
          file,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } catch (error) {
        console.log('Error en uploadFile', error);
      }
    },

    async getFiles(residentId: number, type: string): Promise<any> {
      try {
        const response: AxiosResponse = await apiClient.get(
          `/${process.env.CONTEXT_API_PRIVATE}/file-attachment?residentId=${residentId}&type=${type}`,
        );

        this.files = response.data.attachments;

      } catch (error) {
        console.log('Error en uploadFile', error);
      }
    },

    async deleteFile(fileId: number): Promise<any> {
      try {
        const response: AxiosResponse = await apiClient.delete(
          `/${process.env.CONTEXT_API_PRIVATE}/file-attachment/${fileId}`,
        );

        return response.data;
      } catch (error) {
        console.log('Error en uploadFile', error);
      }
    }
  }
})
