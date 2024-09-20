import axios from "axios";
import { ClienteCreateRequest } from "../DTOs/Cliente/ClienteCreateRequest";
import { ClienteEnderecoCreateRequest } from "../DTOs/Cliente/ClienteEnderecoCreateRequest";
import { API_URL } from "./config";
import { ClienteDetailsResponse } from "../DTOs/Cliente/ClienteDetailsResponse";
import { ClienteSummaryResponse } from "../DTOs/Cliente/ClienteSummaryResponse";
import { ClienteEnderecoResponse } from "../DTOs/Cliente/ClienteEnderecoResponse";
import { EnderecoUpdatePositionRequest } from "../DTOs/Cliente/EnderecoUpdatePositionRequest";

const cliente_API_URL = API_URL + "cliente";

class ClienteService {
  async createCliente(clienteDto: ClienteCreateRequest) {
    try {
      const response = await axios.post(
        `${cliente_API_URL}/create`,
        clienteDto
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      throw error;
    }
  }

  async createEndereco(
    enderecoDto: ClienteEnderecoCreateRequest
  ): Promise<ClienteEnderecoResponse> {
    try {
      const response = await axios.post<ClienteEnderecoResponse>(
        `${cliente_API_URL}/create-address`,
        enderecoDto
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao criar endereço:", error);
      throw error;
    }
  }

  async getClienteByCpfCnpj(CpfCnpj: string): Promise<ClienteDetailsResponse> {
    try {
      const response = await axios.get<ClienteDetailsResponse>(
        `${cliente_API_URL}/${CpfCnpj}`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar cliente por CPF ou CNPJ:", error);
      throw error;
    }
  }

  async getAllClientes(): Promise<ClienteSummaryResponse | undefined> {
    try {
      const response = await axios.get<ClienteSummaryResponse>(cliente_API_URL);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async updateEnderecoPosition(
    enderecoUpdatePositionRequest: EnderecoUpdatePositionRequest
  ): Promise<void> {
    try {
      await axios.put(
        `${cliente_API_URL}/position`,
        enderecoUpdatePositionRequest
      );
    } catch (error) {
      console.error(error);
    }
  }
}

export default new ClienteService();
