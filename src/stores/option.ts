import { defineStore } from 'pinia';

import { AxiosResponse } from 'axios';
import apiClient from 'src/plugins/axios';
import { Regions } from 'src/interfaces/options.interface';

interface OptionState {
  regions: Regions | null;
}

export const useOptionStore = defineStore('option', {
  state: (): OptionState => ({
    regions: null
  }),

  actions: {
    async getComunasRegiones() {
      try {
        const response: AxiosResponse = await apiClient.get<{ data: Regions }>(
          '/option/comunasRegiones'
        );

        this.regions = response.data;
      } catch (error) {
        console.log('Error en getComunasRegiones', error);
      }

    }
  }
})
