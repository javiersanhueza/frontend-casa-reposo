export interface NewResident {
  id?: number;
  name: string;
  paternalSurname: string;
  maternalSurname: string;
  rut: string;
  birthDate: string;
  address: string;
  professionId: string;
  religionId: string;
  guardian: {
    name: string;
    paternalSurname: string;
    maternalSurname: string;
    rut: string;
    phone: string;
    address: string;
  },
  secondaryGuardian: {
    name: string;
    paternalSurname: string;
    maternalSurname: string;
    rut: string;
    phone: string;
    address: string;
  }
}
