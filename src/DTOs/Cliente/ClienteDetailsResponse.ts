import { StatusCliente } from "../../enums/StatusCliente";
import { ClienteEnderecoResponse } from "./ClienteEnderecoResponse";

export interface ClienteDetailsResponse {
  id: number;
  cpfCnpj: string;
  nomeCompleto: string;
  email: string;
  telefone: string;
  status: StatusCliente;
  clienteEnderecos: ClienteEnderecoResponse[];
}
