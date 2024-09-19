import { StatusGuia } from "../../enums/StatusGuia";

export interface GuiaUpdateStatusRequest {
  id: number;
  status: StatusGuia;
}
