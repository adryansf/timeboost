import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateUserButtonDialog from ".";
import UsersAPI from "../../../services/users";
import { toast } from "react-toastify";

jest.mock("../../../services/users");
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe("CreateUserButtonDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the button to open the dialog", () => {
    render(<CreateUserButtonDialog />);

    const openButton = screen.getByTitle("Adicionar Usuário");
    expect(openButton).toBeInTheDocument();
  });

  it("should open the dialog when the button is clicked", async () => {
    render(<CreateUserButtonDialog />);

    const openButton = screen.getByTitle("Adicionar Usuário");
    fireEvent.click(openButton);

    const dialog = await screen.findByTestId("create-user-dialog");
    expect(dialog).toHaveAttribute("data-open", "true");
  });

  it("should close the dialog when the close button is clicked", async () => {
    render(<CreateUserButtonDialog />);

    const openButton = screen.getByTitle("Adicionar Usuário");
    fireEvent.click(openButton);

    const closeButton = screen.getByTitle("Fechar");
    fireEvent.click(closeButton);

    const dialog = await screen.findByTestId("create-user-dialog");
    expect(dialog).toHaveAttribute("data-open", "false");
  });

  it("should show an error if username is too short", async () => {
    render(<CreateUserButtonDialog />);

    const openButton = screen.getByTitle("Adicionar Usuário");
    fireEvent.click(openButton);

    const usernameInput = screen.getByPlaceholderText("Seu melhor username");
    const emailInput = screen.getByPlaceholderText("Seu melhor email");
    const passwordInput = screen.getByPlaceholderText("Digite uma senha");
    const submitButton = screen.getByText("Criar");

    fireEvent.change(usernameInput, { target: { value: "ab" } });
    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "O username deve ter no mínimo 3 caracteres"
      );
    });
  });

  it("should show an error if password is too short", async () => {
    render(<CreateUserButtonDialog />);

    const openButton = screen.getByTitle("Adicionar Usuário");
    fireEvent.click(openButton);

    const usernameInput = screen.getByPlaceholderText("Seu melhor username");
    const emailInput = screen.getByPlaceholderText("Seu melhor email");
    const passwordInput = screen.getByPlaceholderText("Digite uma senha");
    const submitButton = screen.getByText("Criar");

    fireEvent.change(usernameInput, { target: { value: "username" } });
    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "123" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "A senha deve ter no mínimo 8 caracteres"
      );
    });
  });

  it("should show a success message when the user is created successfully", async () => {
    (UsersAPI.create as jest.Mock).mockResolvedValue({ ok: true });

    render(<CreateUserButtonDialog />);

    const openButton = screen.getByTitle("Adicionar Usuário");
    fireEvent.click(openButton);

    const usernameInput = screen.getByPlaceholderText("Seu melhor username");
    const emailInput = screen.getByPlaceholderText("Seu melhor email");
    const passwordInput = screen.getByPlaceholderText("Digite uma senha");
    const submitButton = screen.getByText("Criar");

    fireEvent.change(usernameInput, { target: { value: "username" } });
    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Usuário criado com sucesso!");
    });
  });

  it("should handle API errors correctly", async () => {
    const errorResponse = {
      ok: false,
      message: "Erro ao criar usuário",
      statusCode: 400,
    };
    (UsersAPI.create as jest.Mock).mockResolvedValue(errorResponse);

    render(<CreateUserButtonDialog />);

    const openButton = screen.getByTitle("Adicionar Usuário");
    fireEvent.click(openButton);

    const usernameInput = screen.getByPlaceholderText("Seu melhor username");
    const emailInput = screen.getByPlaceholderText("Seu melhor email");
    const passwordInput = screen.getByPlaceholderText("Digite uma senha");
    const submitButton = screen.getByText("Criar");

    fireEvent.change(usernameInput, { target: { value: "username" } });
    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Erro ao criar usuário");
    });
  });
});
