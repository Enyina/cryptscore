export interface updateUserDto {
  name?: string;
  email?: string;
  number?: string;
}
export interface updateUserPasswordDto {
  password: string;
  oldPassword: string;
}
