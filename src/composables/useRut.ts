
export function useRut() {
  const cleanRut = (rut: string): string => {
    return rut.replace(/[^0-9kK]/g, '').toUpperCase();
  };

  const formatRut = (rut: string): string => {
    const cleaned = cleanRut(rut);
    if (!cleaned) return '';

    let result = cleaned;
    if (cleaned.length > 1) {
      const body = cleaned.slice(0, -1);
      const dv = cleaned.slice(-1);
      const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      result = `${formattedBody}-${dv}`;
    }
    return result;
  };

  const validateRut = (rut: string): boolean => {
    if (!rut) return false;

    const cleaned = cleanRut(rut);
    if (cleaned.length < 8) return false;

    const body = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1);

    let sum = 0;
    let multiplier = 2;

    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body.charAt(i), 10) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const expectedDv = 11 - (sum % 11);
    const calculatedDv = expectedDv === 11 ? '0' : expectedDv === 10 ? 'K' : expectedDv.toString();

    return dv === calculatedDv;
  };

  return {
    cleanRut,
    formatRut,
    validateRut
  };
}
