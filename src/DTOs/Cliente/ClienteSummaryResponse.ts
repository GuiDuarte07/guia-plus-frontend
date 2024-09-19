import { StatusCliente } from "../../enums/StatusCliente";

export interface ClienteSummaryResponse {
  id: number;
  nomeCompleto: string;
  status: StatusCliente;
}
