import { StatusCliente } from "../../enums/StatusCliente";

export interface ClienteCreateRequest {
  cpfCnpj: string;
  nomeCompleto: string;
  email: string;
  telefone: string;
  status: StatusCliente;
}
