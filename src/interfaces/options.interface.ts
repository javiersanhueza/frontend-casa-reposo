
export interface Regions {
  name: string;
  regions: Region[]
}

interface Region {
  name: string;
  romanNumber: string;
  number: string;
  communes: Commune[]
}

interface Commune {
  name: string;
}

export interface Options {
  description: string;
}
