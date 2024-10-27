import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import User from ".";
import { IUser } from "../../../services/users";
import UsersApi from "../../../services/users";
import { toast } from "react-toastify";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

// Mock do serviço de deleção de usuários e do toast
jest.mock("../../../services/users");
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe("User Component", () => {
  const mockUser: IUser = {
    id: "id",
    username: "testuser",
    email: "testuser@example.com",
    createdAt: new Date(2023, 0, 1, 12, 0).toISOString(), // 01/01/2023 12:00
    updatedAt: new Date(2023, 0, 2, 15, 30).toISOString(), // 02/01/2023 15:30
    idLevel: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render user information correctly", () => {
    render(<User user={mockUser} />);

    // Verifica se o nome de usuário, email e datas estão sendo exibidos corretamente
    expect(screen.getByText(mockUser.username)).toBeInTheDocument();
    expect(screen.getByText(`${mockUser.email}`)).toBeInTheDocument();

    const createdAtFormatted = format(
      mockUser.createdAt,
      "dd/MM/yyyy 'às' HH:mm",
      {
        locale: ptBR,
      }
    );
    expect(screen.getByText(`${createdAtFormatted}`)).toBeInTheDocument();

    const updatedAtFormatted = formatDistanceToNow(mockUser.updatedAt, {
      locale: ptBR,
      addSuffix: true,
    });
    expect(screen.getByText(`${updatedAtFormatted}`)).toBeInTheDocument();

    // Verifica se a imagem de avatar está presente
    const avatar = screen.getByAltText(mockUser.username);
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute(
      "src",
      `https://api.multiavatar.com/${mockUser.username}.svg`
    );
  });

  test("should call delete API and show success toast on successful deletion", async () => {
    (UsersApi.delete as jest.Mock).mockResolvedValue({ ok: true });

    render(<User user={mockUser} />);

    // Clica no botão de deletar
    fireEvent.click(screen.getByTitle("Deletar usuário"));

    // Verifica se a função de deleção foi chamada com o ID correto
    await waitFor(() => {
      expect(UsersApi.delete).toHaveBeenCalledWith(mockUser.id);
    });

    // Verifica se o toast de sucesso foi chamado
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Usuário deletado com sucesso!"
      );
    });
  });

  test("should show error toast if delete API call fails", async () => {
    (UsersApi.delete as jest.Mock).mockResolvedValue({ ok: false });

    render(<User user={mockUser} />);

    // Clica no botão de deletar
    fireEvent.click(screen.getByTitle("Deletar usuário"));

    // Verifica se a função de deleção foi chamada com o ID correto
    await waitFor(() => {
      expect(UsersApi.delete).toHaveBeenCalledWith(mockUser.id);
    });

    // Verifica se o toast de erro foi chamado
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled(); // handleError exibe um erro
    });
  });

  test("should render EditUserButtonDialog component", () => {
    render(<User user={mockUser} />);

    // Verifica se o botão de editar usuário está presente
    const editButton = screen.getByTitle("Editar usuário");
    expect(editButton).toBeInTheDocument();
  });
});
