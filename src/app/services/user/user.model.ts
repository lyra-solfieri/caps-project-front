export interface UserDto {
  id: number;
  email: string;
  nome: string;
  role: string;
  ativo?: boolean;
}

export interface UpdateUserDto {
  email?: string;
  nome?: string;
}
