export interface UserList {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  cidade: string;
  estado: string;
  latitude: string;
  longitude: string;
  password: string;
  email: string;
  IdUserCreate: number;
  resetCode: string;
}

export type UserFormData = {
  nome: string;
  cpf: string;
  telefone: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento?: string;
  cidade: string;
  estado: string;
  latitude: string;
  longitude: string;
  password?: string;
  email: string;
};
