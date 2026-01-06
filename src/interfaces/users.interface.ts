export interface User {
  userId: number;
  email: string;
  firstName: string;
  firstSurname: string;
  secondName: string | null;
  secondSurname: string | null;
  dateBirth: string;
  nationality: string;
  city: string;
  commune: string;
  address: string;
  roles: UserRoles;
  run: string;
  photo: string | null;
  gender: Gender | string;
  phones: string[];
  stateUser: UserState | string;
  owner: any | null;
  proxy: any | null;
  employee: any | null;
}

export interface UserRoles {
  superUser: boolean;
  admin: boolean;
  owner: boolean;
  employee: boolean;
  proxy: boolean;
}

export type UserState = 'Approved' | 'Pending' | 'Rejected' | 'Blocked';
export type Gender = 'Masculino' | 'Femenino' | 'Otro';

export interface CreateUserPayload {
  email: string;
  firstName: string;
  firstSurname: string;
  secondName?: string;
  secondSurname?: string;
  password: string;
  secret?: string;
  role?: string;
}
