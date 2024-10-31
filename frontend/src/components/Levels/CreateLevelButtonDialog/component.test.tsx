import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateLevelButtonDialog from ".";
import LevelsAPI from "../../../services/levels";
import { toast } from "react-toastify";

jest.mock("../../../services/levels");
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe("CreateLevelButtonDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the button to open the dialog", () => {
    render(<CreateLevelButtonDialog />);

    const openButton = screen.getByTitle("Criar Level");
    expect(openButton).toBeInTheDocument();
  });

  it("should open the dialog when the button is clicked", async () => {
    render(<CreateLevelButtonDialog />);

    const openButton = screen.getByTitle("Criar Level");
    fireEvent.click(openButton);

    const dialog = await screen.findByTestId("create-level-dialog");
    expect(dialog).toHaveAttribute("data-open", "true");
  });

  it("should close the dialog when the close button is clicked", async () => {
    render(<CreateLevelButtonDialog />);

    const openButton = screen.getByTitle("Criar Level");
    fireEvent.click(openButton);

    const closeButton = screen.getByTitle("Fechar");
    fireEvent.click(closeButton);

    const dialog = await screen.findByTestId("create-level-dialog");
    expect(dialog).toHaveAttribute("data-open", "false");
  });

  it("should show an error if name is too short", async () => {
    render(<CreateLevelButtonDialog />);

    const openButton = screen.getByTitle("Criar Level");
    fireEvent.click(openButton);

    // Altera o valor do name para um valor inválido
    fireEvent.change(screen.getByPlaceholderText("Ex: Mestre"), {
      target: { value: "ab" },
    });

    // Altera o valor do pointsRequired para um valor válido
    fireEvent.change(screen.getByPlaceholderText("Ex: 10"), {
      target: { value: 10 },
    });

    // Submete o formulário
    fireEvent.submit(screen.getByTestId("create-level-form"));

    // Verifica se o toast de erro foi chamado
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "O nome deve ter no mínimo 3 caracteres"
      );
    });
  });

  it("should show an error if pointsRequired is invalid", async () => {
    render(<CreateLevelButtonDialog />);

    const openButton = screen.getByTitle("Criar Level");
    fireEvent.click(openButton);

    // Altera o valor do name para um valor inválido
    fireEvent.change(screen.getByPlaceholderText("Ex: Mestre"), {
      target: { value: "abc" },
    });

    // Altera o valor do pointsRequired para um valor válido
    fireEvent.change(screen.getByPlaceholderText("Ex: 10"), {
      target: { value: "a" },
    });

    // Submete o formulário
    fireEvent.submit(screen.getByTestId("create-level-form"));

    // Verifica se o toast de erro foi chamado
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "A quantidade de pontos necessários deve ser maior que 0 (zero)"
      );
    });
  });

  it("should show a success message when the user is created successfully", async () => {
    (LevelsAPI.create as jest.Mock).mockResolvedValue({ ok: true });

    render(<CreateLevelButtonDialog />);

    const openButton = screen.getByTitle("Criar Level");
    fireEvent.click(openButton);

    // Altera o valor do name para um valor válido
    fireEvent.change(screen.getByPlaceholderText("Ex: Mestre"), {
      target: { value: "abc" },
    });

    // Altera o valor do pointsRequired para um valor válido
    fireEvent.change(screen.getByPlaceholderText("Ex: 10"), {
      target: { value: 10 },
    });
    const submitButton = screen.getByText("Criar");

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Level criado com sucesso!");
    });
  });

  it("should handle API errors correctly", async () => {
    const errorResponse = {
      ok: false,
      message: "Erro ao criar level",
      statusCode: 400,
    };
    (LevelsAPI.create as jest.Mock).mockResolvedValue(errorResponse);

    render(<CreateLevelButtonDialog />);

    const openButton = screen.getByTitle("Criar Level");
    fireEvent.click(openButton);

    // Altera o valor do name para um valor válido
    fireEvent.change(screen.getByPlaceholderText("Ex: Mestre"), {
      target: { value: "abc" },
    });

    // Altera o valor do pointsRequired para um valor válido
    fireEvent.change(screen.getByPlaceholderText("Ex: 10"), {
      target: { value: 10 },
    });
    const submitButton = screen.getByText("Criar");

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Erro ao criar level");
    });
  });
});
