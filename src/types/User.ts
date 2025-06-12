export interface UserDTO {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'EDUCATOR' | 'STUDENT' | 'GUEST' | 'DEVELOPER';
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserRegisterDTO {
  username: string;
  password: string;
  email: string;
  role: 'ADMIN' | 'EDUCATOR' | 'STUDENT' | 'GUEST' | 'DEVELOPER';
}

export interface UserLoginDTO {
  login: string;
  password: string;
}

export interface UserCredentialsDTO {
  username: string;
  email: string;
  newPassword: string;
  oldPassword: string;
}

export interface UserDeleteDTO {
  password: string;
}
