import axios from "axios";
import { API_URL } from "./config";
import { ServicoCreateRequest } from "../DTOs/Servico/ServicoCreateRequest";
import { ServicoResponse } from "../DTOs/Servico/ServicoResponse";

const cliente_API_URL = API_URL + "servico";

class ServicoService {
  async createService(servico: ServicoCreateRequest): Promise<ServicoResponse> {
    try {
      const response = await axios.post<ServicoResponse>(
        `${cliente_API_URL}`,
        servico
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao criar serviço:", error);
      throw error;
    }
  }

  async getAllServicos(): Promise<ServicoResponse[]> {
    try {
      const response = await axios.get<ServicoResponse[]>(`${cliente_API_URL}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
      throw error;
    }
  }
}

export default new ServicoService();
