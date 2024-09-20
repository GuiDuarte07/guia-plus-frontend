import axios from "axios";

const identity_API_URL = "https://localhost:8081/" + "identity";

interface LoginResponse {
  tokenType: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}

class AuthService {
  async login(access: {
    email: string;
    password: string;
  }): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(
        `${identity_API_URL}/login`,
        access
      );

      if (response.data) {
        const { accessToken, refreshToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      }
      return response.data;
    } catch (error) {
      console.error("Erro ao logar:", error);
      throw error;
    }
  }

  async register(access: { email: string; password: string }) {
    try {
      const response = await axios.post(`${identity_API_URL}/register`, access);
      return response.data;
    } catch (error) {
      console.error("Erro ao logar:", error);
      throw error;
    }
  }

  isTokenValid() {
    //tem algum problema no token gerado pelo identity ou a as informações nele são diferentes
    //como nao tenho mais tempo vou só verificar se o token existe
    const token = localStorage.getItem("accessToken");
    if (!token) return false;

    return true;
  }

  async refreshAccessToken() {
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      const response = await axios.post(`${identity_API_URL}/refresh`, {
        refreshToken,
      });
      const { accessToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      return response.data;
    } catch (error) {
      console.error("Erro ao renovar o token:", error);
      throw error;
    }
  }
}

export default new AuthService();
