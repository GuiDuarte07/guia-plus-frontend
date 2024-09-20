import { StatusCliente } from "../../enums/StatusCliente";
import { ClienteEnderecoResponse } from "./ClienteEnderecoResponse";

export interface ClienteDetailsResponse {
  id: number;
  cpf_cnpj: string;
  nomeCompleto: string;
  email: string;
  telefone: string;
  status: StatusCliente;
  clienteEnderecos: ClienteEnderecoResponse[];
}
