import { UserFormData } from "../model/user-model";
import { isSuccessRequest } from "../utils/response-request";
import api from "./api";

export const fetchLogin = async (email: string, password: string) => {
  try {
    const response = await api.post("/usuarios/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("Erro no fetchLogin:", error);
    return false;
  }
};

export const resetPasswordSendToken = async (email: string) => {
  try {
    const response = await api.post("/usuarios/forgot-password", { email });
    return response.data;
  } catch (error) {
    console.error("Erro no fetchLogin:", error);
    return false;
  }
};

export const resetPassword = async (
  email: string,
  resetCode: string,
  newPassword: string
) => {
  try {
    const response = await api.put("/usuarios/reset-password", {
      email,
      resetCode,
      newPassword,
    });
    return response;
  } catch (error) {
    console.error("Erro no resetPassword:", error);
    return error;
  }
};

export const resetCodeDelete = async (email: string, resetCode: string) => {
  try {
    const response = await api.put("/usuarios/clean-resetCode", {
      email,
      resetCode,
    });
    return response;
  } catch (error) {
    console.error("Erro no resetCode Delete:", error);
    return error;
  }
};

export const fetchUserList = async (
  page: number,
  totalItemsByPage: number,
  search: string,
  userId: number
) => {
  try {
    const response = await api.get("usuarios/list", {
      headers: {
        "user-id": userId, // Enviar o ID do usuário no cabeçalho da requisição
      },
      params: { page, totalItemsByPage, search },
    });

    if (response.data) {
      return response.data;
    }
    return false;
  } catch (error) {
    console.error("Erro", error);
    return false;
  }
};

export const deleteUser = async (
  id: string,
  password: string,
  loggedUserId: number
) => {
  try {
    const response = await api.delete(`/usuarios/deletar/${id}`, {
      data: { password, loggedUserId },
    });

    if (isSuccessRequest(response.status)) {
      return response;
    }
    return false;
  } catch (error) {
    console.error("Erro ao deletar o Usuário", error);
    return false;
  }
};

export const saveUser = async (usuario: {
  nome: string;
  cpf: string;
  telefone: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento?: string;
  cidade: string;
  estado: string;
  latitude: string;
  longitude: string;
  password: string;
  email: string;
  IdUserCreate: number;
}) => {
  try {
    const response = await api.post("/usuarios/new", {
      ...usuario,
      resetCode: "",
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao salvar usuário:", error);
    throw error;
  }
};

export const getUserById = async (id: string) => {
  try {
    const response = await api.get(`/usuarios/byId/${id}`);
    if (isSuccessRequest(response.status)) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar o Usuário", error);
    return null;
  }
};

export const updateIdUserCreate = async (
  userId: number,
  newIdUserCreate: number
) => {
  try {
    const response = await api.patch(`/usuarios/updateUser/${userId}`, {
      IdUserCreate: newIdUserCreate,
    });
    console.log("🚀 response - ", response);

    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar o IdUserCreate:", error);
    return false;
  }
};

export const editarUsuario = async (
  id: number,
  data: Partial<UserFormData>
) => {
  try {
    const response = await api.patch(`/usuarios/editById/${id}`, data);
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Erro ao editar o usuário:", error);
    throw error; // Rejeita a promessa para que o erro possa ser tratado
  }
};
