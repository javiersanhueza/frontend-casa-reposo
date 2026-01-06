
export default function useRutUtils() {
  function cleanRut(value: string): string {
    return value.replace(/[^\dkK]/g, '').toUpperCase()
  }

  function isValidRut(value: string): boolean {
    const rut = cleanRut(value)
    if (rut.length < 2) return false

    const body = rut.slice(0, -1)
    const dv = rut.slice(-1)

    let sum = 0
    let multiplier = 2

    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i]) * multiplier
      multiplier = multiplier === 7 ? 2 : multiplier + 1
    }

    const expectedDv = 11 - (sum % 11)
    const dvCalc = expectedDv === 11 ? '0' : expectedDv === 10 ? 'K' : expectedDv.toString()

    return dv === dvCalc
  }

  function formatRut(value: string): string {
    const rut = cleanRut(value)
    if (rut.length < 2) return value

    const body = rut.slice(0, -1)
    const dv = rut.slice(-1)

    const formattedBody = body
      .split('')
      .reverse()
      .reduce((acc, digit, index) => {
        return acc + digit + ((index + 1) % 3 === 0 && index + 1 !== body.length ? '.' : '')
      }, '')
      .split('')
      .reverse()
      .join('')

    return `${formattedBody}-${dv}`
  }

  return { isValidRut, formatRut, cleanRut }
}
