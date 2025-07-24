import moment from 'moment/moment';

export const globalMixin = {
  methods: {
    getNameCompany(): string {
      const userData = localStorage.getItem('user');
      if (userData) {
        return JSON.parse(userData).company.companyName;
      }
      return '';
    },

    getIdCompany(): number {
      const user = localStorage.getItem('user');
      if (user) {
        return JSON.parse(user).companyId;
      }
      return 0;
    },

    formatDate(date: string, format: string = 'DD/MM/YYYY'): string {
      return moment(date).format(format);
    },

    calculateAge(birthDate: string): number {
      const [year, month, day] = birthDate.split('-').map(Number);
      const birthDay = new Date(year, month - 1, day);
      const today = new Date();

      let age = today.getFullYear() - birthDay.getFullYear();

      const hasCompliedThisYear =
        today.getMonth() > birthDay.getMonth() ||
        (today.getMonth() === birthDay.getMonth() && today.getDate() >= birthDay.getDate());

      if (!hasCompliedThisYear) {
        age--;
      }

      return age;
    },

    dataURLtoBlob(dataURL: string): Blob {
      const byteString = atob(dataURL.split(',')[1]);
      const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];

      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ab], { type: mimeString });
    }
  }


}
