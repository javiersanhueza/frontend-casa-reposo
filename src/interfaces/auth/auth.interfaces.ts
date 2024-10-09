export interface LoginResponse {
  token: string;
  user: UserLogin
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
