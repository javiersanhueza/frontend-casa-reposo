import { defineStore } from 'pinia';

import { AxiosResponse } from 'axios';
import apiClient from 'src/plugins/axios';
import { Options } from 'src/interfaces/options.interface';

interface OptionState {
  professions: Options[] | null;
  religions: Options[] | null;
}

export const useOptionStore = defineStore('option', {
  state: (): OptionState => ({
    professions: [],
    religions: []
  }),

  actions: {
    async getOptionsResidentForm() {
      try {
        const response: AxiosResponse = await apiClient.get(
          `/${process.env.CONTEXT_API_PRIVATE}/options/resident-form`
        )

        this.professions = response.data.professions;
        this.religions = response.data.religions;
      } catch (error) {
        console.log('Error en getOptionsResidentForm', error);
      }
    }
  }
})
