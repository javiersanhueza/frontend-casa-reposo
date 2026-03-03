export interface Company {
  companyId: number;
  name: string;
  rut: string;
  dateStart: string;
  imagen: string;
  mapUrl: string;
  address: string;
  city: string;
  commune: string;
  description: string;
  listResidents: Resident[],
  listOwners: Owner[],
  listEmployees: Employee[],
}

export interface NewCompany {
  companyId?: number;
  name: string;
  rut: string;
  region: string;
  city: string;
  commune: string;
  address: string;
  description: string;
  mapUrl: string;
  dateStart: string;
  details: any;
}

interface Resident {
  firstName: string;
  firstSurname: string;
  photo: string;
  userId: number;
  run: string;
}

interface Owner {
  companyOwnerId: number;
  state: string;
  firstName: string;
  firstSurname: string;
  photo: string;
  userId: number;
  run: string;
}

interface Employee {
  companyEmployeeId: number;
  state: string;
  firstName: string;
  firstSurname: string;
  photo: string;
  userId: number;
}


