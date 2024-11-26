export const rutMixin = {
  methods: {
    validateRut(rut: string) {
      if (!rut) return false;
      const cleanRut = rut.replace(/[^0-9kK]/g, '').toUpperCase();
      if (cleanRut.length < 2) return false;

      const body = cleanRut.slice(0, -1);
      const dv = cleanRut.slice(-1);

      let sum = 0;
      let multiplier = 2;

      for (let i = body.length - 1; i >= 0; i--) {
        sum += parseInt(body[i]) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
      }

      const calculatedDv = 11 - (sum % 11);
      const validDv = calculatedDv === 11 ? '0' : calculatedDv === 10 ? 'K' : calculatedDv.toString();

      return dv === validDv;
    },

    formatRut(value: string | number | null) {
      if (typeof value !== 'string') return '';

      let cleanValue = value.replace(/[^0-9kK]/g, '').toUpperCase();

      if (cleanValue.length > 1) {
        cleanValue = cleanValue.slice(0, -1) + '-' + cleanValue.slice(-1);
      }

      return cleanValue;
    }
  }
}
