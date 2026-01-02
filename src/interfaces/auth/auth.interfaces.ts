export interface UserRoles {
  superUser: boolean;
  admin: boolean;
  owner: boolean;
  employee: boolean;
  proxy: boolean;
}

export interface UserData {
  firstName: string;
  firstSurname: string;
  photo: string | null;
  roles: UserRoles;
  token: string;
}

export interface LoginResponse {
  statusCode: number;
  send: string;
  data: UserData;
}
export interface DefaultResponse {
  message: string;
}

export interface RegisterResponse {
  message: string;
  user: UserLogin;
}

export interface UserLogin {
  createdAt: string;
  email: string;
  id: number;
  name: string;
  password: string;
  updatedAt: string;
}
