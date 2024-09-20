import { StatusCliente } from "../../enums/StatusCliente";

export interface ClienteSummaryResponse {
  id: number;
  nomeCompleto: string;
  cpf_cnpj: string;
  status: StatusCliente;
}
