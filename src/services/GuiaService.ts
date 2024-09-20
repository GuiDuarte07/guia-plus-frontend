import axios from "axios";
import { API_URL } from "./config";
import { GuiaCreateRequest } from "../DTOs/Guia/GuiaCreateRequest";
import { GuiaResponse } from "../DTOs/Guia/GuiaResponse";
import { GuiaUpdateStatusRequest } from "../DTOs/Guia/GuiaUpdateStatusRequest";
import { GuiaUpdateEnderecoRequest } from "../DTOs/Guia/GuiaUpdateEnderecoRequest";

const guia_API_URL = `${API_URL}guia`;

class GuiaService {
  // Método para criar uma nova guia
  async createGuia(guia: GuiaCreateRequest): Promise<GuiaResponse> {
    try {
      const response = await axios.post<GuiaResponse>(`${guia_API_URL}`, guia);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar guia:", error);
      throw error;
    }
  }

  // Método para buscar todas as guias
  async getAllGuias(): Promise<GuiaResponse[]> {
    try {
      const response = await axios.get<GuiaResponse[]>(`${guia_API_URL}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar guias:", error);
      throw error;
    }
  }

  // Método para deletar uma guia por ID
  async deleteGuia(id: number): Promise<void> {
    try {
      await axios.delete(`${guia_API_URL}/${id}`);
    } catch (error) {
      console.error("Erro ao deletar guia:", error);
      throw error;
    }
  }

  // Método para atualizar o status de uma guia
  async updateGuiaStatus(request: GuiaUpdateStatusRequest): Promise<void> {
    try {
      await axios.put(`${guia_API_URL}/status`, request);
    } catch (error) {
      console.error("Erro ao atualizar o status da guia:", error);
      throw error;
    }
  }

  // Método para atualizar o endereço de uma guia
  async updateGuiaEndereco(request: GuiaUpdateEnderecoRequest): Promise<void> {
    try {
      await axios.put(`${guia_API_URL}/endereco`, request);
    } catch (error) {
      console.error("Erro ao atualizar o endereço da guia:", error);
      throw error;
    }
  }
}

export default new GuiaService();
