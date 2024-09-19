import { StatusGuia } from "../../enums/StatusGuia";
import { ClienteEnderecoResponse } from "../Cliente/ClienteEnderecoResponse";
import { ClienteSummaryResponse } from "../Cliente/ClienteSummaryResponse";
import { ServicoResponse } from "../Servico/ServicoResponse";

export interface GuiaResponse {
  id: number;
  cliente: ClienteSummaryResponse;
  servico: ServicoResponse;
  clienteEndereco: ClienteEnderecoResponse;
  numeroGuia: string;
  status: StatusGuia;
  dataHoraRegistro: Date;
  dataHoraIniciouColeta?: Date;
  dataHoraConfirmouRetirada?: Date;
}
