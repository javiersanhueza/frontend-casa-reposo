export interface Employee {
  id: number;
  companyId: number;
  firstName: string;
  paternalSurname: string;
  maternalSurname: string;
  rut: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewEmployee {
  firstName: string;
  paternalSurname: string;
  maternalSurname: string;
  rut: string;
}
