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
  email: string;
  firstName: string;
  firstSurname: string;
  secondName: string;
  secondSurname: string;
  run: string;
  employeeRole: string;
  password: string;
}
