import moment from 'moment/moment';

export const globalMixin = {
  methods: {
    getNameCompany(): string {
      const companyData = localStorage.getItem('company');
      if (companyData) {
        return JSON.parse(companyData).companyName;
      }
      return '';
    },

    getIdCompany(): number {
      const companyData = localStorage.getItem('company');
      if (companyData) {
        return JSON.parse(companyData).id;
      }
      return 0;
    },

    formatDate(date: string, format: string = 'DD/MM/YYYY'): string {
      return moment(date).format(format);
    }
  }


}
