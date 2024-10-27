import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditUserButtonDialog from ".";
import { toast } from "react-toastify";
import UsersAPI, { IUser } from "../../../services/users";

// Mock do serviço de atualização de usuários e do toast
jest.mock("../../../services/users");
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe("EditUserButtonDialog", () => {
  const mockUser: IUser = {
    id: "a",
    username: "testuser",
    email: "testuser@example.com",
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
    idLevel: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should open the dialog when the edit button is clicked", () => {
    render(<EditUserButtonDialog user={mockUser} />);

    // Verifica se o diálogo está inicialmente oculto
    expect(screen.getByTestId("edit-user-dialog")).toHaveAttribute(
      "data-open",
      "false"
    );

    // Clica no botão de editar
    fireEvent.click(screen.getByTitle("Editar usuário"));

    // Verifica se o diálogo foi exibido
    expect(screen.getByTestId("edit-user-dialog")).toHaveAttribute(
      "data-open",
      "true"
    );
  });

  test("should close the dialog when the close button is clicked", () => {
    render(<EditUserButtonDialog user={mockUser} />);

    // Abre o diálogo
    fireEvent.click(screen.getByTitle("Editar usuário"));

    // Verifica se o diálogo foi exibido
    expect(screen.getByTestId("edit-user-dialog")).toHaveAttribute(
      "data-open",
      "true"
    );

    // Clica no botão de fechar
    fireEvent.click(screen.getByTitle("Fechar"));

    // Verifica se o diálogo foi ocultado
    expect(screen.getByTestId("edit-user-dialog")).toHaveAttribute(
      "data-open",
      "false"
    );
  });

  test("should show an error if username is less than 3 characters", async () => {
    render(<EditUserButtonDialog user={mockUser} />);

    fireEvent.click(screen.getByTitle("Editar usuário"));

    // Altera o valor do username para um valor inválido
    fireEvent.change(screen.getByPlaceholderText("Seu melhor username"), {
      target: { value: "ab" },
    });

    // Altera o valor do email para um valor válido
    fireEvent.change(screen.getByPlaceholderText("Seu melhor email"), {
      target: { value: "valid@example.com" },
    });

    // Submete o formulário
    fireEvent.submit(screen.getByTestId("edit-user-form"));

    // Verifica se o toast de erro foi chamado
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "O username deve ter no mínimo 3 caracteres"
      );
    });
  });

  test("should show an error if email is empty", async () => {
    render(<EditUserButtonDialog user={mockUser} />);

    fireEvent.click(screen.getByTitle("Editar usuário"));

    // Altera o valor do username para um valor válido
    fireEvent.change(screen.getByPlaceholderText("Seu melhor username"), {
      target: { value: "validusername" },
    });

    // Altera o valor do email para vazio
    fireEvent.change(screen.getByPlaceholderText("Seu melhor email"), {
      target: { value: "" },
    });

    // Submete o formulário
    fireEvent.submit(screen.getByTestId("edit-user-form"));

    // Verifica se o toast de erro foi chamado
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Informe um email válido");
    });
  });

  test("should submit the form successfully if inputs are valid", async () => {
    (UsersAPI.update as jest.Mock).mockResolvedValue({ ok: true });

    render(<EditUserButtonDialog user={mockUser} />);

    fireEvent.click(screen.getByTitle("Editar usuário"));

    // Altera os valores dos campos
    fireEvent.change(screen.getByPlaceholderText("Seu melhor username"), {
      target: { value: "newusername" },
    });

    fireEvent.change(screen.getByPlaceholderText("Seu melhor email"), {
      target: { value: "newemail@example.com" },
    });

    // Submete o formulário
    fireEvent.submit(screen.getByTestId("edit-user-form"));

    // Verifica se o serviço foi chamado com os dados corretos
    await waitFor(() => {
      expect(UsersAPI.update).toHaveBeenCalledWith(mockUser.id, {
        username: "newusername",
        email: "newemail@example.com",
      });

      // Verifica se o toast de sucesso foi chamado
      expect(toast.success).toHaveBeenCalledWith("Usuário salvo com sucesso!");
    });
  });

  test("should show an error if the API call fails", async () => {
    (UsersAPI.update as jest.Mock).mockResolvedValue({ ok: false });

    render(<EditUserButtonDialog user={mockUser} />);

    fireEvent.click(screen.getByTitle("Editar usuário"));

    // Altera os valores dos campos
    fireEvent.change(screen.getByPlaceholderText("Seu melhor username"), {
      target: { value: "newusername" },
    });

    fireEvent.change(screen.getByPlaceholderText("Seu melhor email"), {
      target: { value: "newemail@example.com" },
    });

    // Submete o formulário
    fireEvent.submit(screen.getByTestId("edit-user-form"));

    // Verifica se o handleError foi chamado
    await waitFor(() => {
      expect(UsersAPI.update).toHaveBeenCalledWith(mockUser.id, {
        username: "newusername",
        email: "newemail@example.com",
      });

      expect(toast.error).toHaveBeenCalled(); // handleError deve exibir um erro
    });
  });

  test("should show an error if user does not exist", async () => {
    const invalidUser = undefined as unknown as IUser; // Modifica o ID para simular um usuário inválido

    render(<EditUserButtonDialog user={invalidUser} />);

    fireEvent.click(screen.getByTitle("Editar usuário"));

    // Altera os valores dos campos
    fireEvent.change(screen.getByPlaceholderText("Seu melhor username"), {
      target: { value: "newusername" },
    });

    fireEvent.change(screen.getByPlaceholderText("Seu melhor email"), {
      target: { value: "newemail@example.com" },
    });

    // Submete o formulário
    fireEvent.submit(screen.getByTestId("edit-user-form"));

    expect(toast.error).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
    expect(UsersAPI.update).not.toHaveBeenCalled();
  });
});
