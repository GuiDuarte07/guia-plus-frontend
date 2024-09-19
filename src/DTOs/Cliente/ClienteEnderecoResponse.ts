export interface ClienteEnderecoResponse {
  id: number;
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  complemento: string;
  numero: string;
  latitude: number;
  longitude: number;
}
