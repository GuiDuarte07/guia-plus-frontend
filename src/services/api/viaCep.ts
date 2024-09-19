import axios from "axios";

interface ViaCepError {
  erro: true;
}

// Defina o tipo para uma resposta válida
export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

type ViaCepResult = ViaCepResponse | ViaCepError;

export const fetchCep = async (cep: string): Promise<ViaCepResponse | null> => {
  try {
    const response = await axios.get<ViaCepResult>(
      `https://viacep.com.br/ws/${cep}/json/`
    );

    const data = response.data;

    if ("erro" in data) {
      return null;
    }

    return data;
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    return null;
  }
};
