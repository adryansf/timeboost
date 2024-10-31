import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditLevelButtonDialog from ".";
import { toast } from "react-toastify";
import LevelsAPI, { ILevel } from "../../../services/levels";

// Mock do serviço de atualização de usuários e do toast
jest.mock("../../../services/levels");
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe("EditLevelButtonDialog", () => {
  const mockLevel: ILevel = {
    id: 1,
    name: "Iniciante",
    pointsRequired: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should open the dialog when the edit button is clicked", () => {
    render(<EditLevelButtonDialog level={mockLevel} />);

    // Verifica se o diálogo está inicialmente oculto
    expect(screen.getByTestId("edit-level-dialog")).toHaveAttribute(
      "data-open",
      "false"
    );

    // Clica no botão de editar
    fireEvent.click(screen.getByTitle("Editar level"));

    // Verifica se o diálogo foi exibido
    expect(screen.getByTestId("edit-level-dialog")).toHaveAttribute(
      "data-open",
      "true"
    );
  });

  test("should close the dialog when the close button is clicked", () => {
    render(<EditLevelButtonDialog level={mockLevel} />);

    // Abre o diálogo
    fireEvent.click(screen.getByTitle("Editar level"));

    // Verifica se o diálogo foi exibido
    expect(screen.getByTestId("edit-level-dialog")).toHaveAttribute(
      "data-open",
      "true"
    );

    // Clica no botão de fechar
    fireEvent.click(screen.getByTitle("Fechar"));

    // Verifica se o diálogo foi ocultado
    expect(screen.getByTestId("edit-level-dialog")).toHaveAttribute(
      "data-open",
      "false"
    );
  });

  test("should show an error if name is less than 3 characters", async () => {
    render(<EditLevelButtonDialog level={mockLevel} />);

    fireEvent.click(screen.getByTitle("Editar level"));

    // Altera o valor do name para um valor inválido
    fireEvent.change(screen.getByPlaceholderText("Ex: Mestre"), {
      target: { value: "ab" },
    });

    // Altera o valor do pointsRequired para um valor válido
    fireEvent.change(screen.getByPlaceholderText("Ex: 10"), {
      target: { value: 10 },
    });

    // Submete o formulário
    fireEvent.submit(screen.getByTestId("edit-level-form"));

    // Verifica se o toast de erro foi chamado
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "O nome deve ter no mínimo 3 caracteres"
      );
    });
  });

  test("should show an error if pointsRequired is invalid", async () => {
    render(<EditLevelButtonDialog level={mockLevel} />);

    fireEvent.click(screen.getByTitle("Editar level"));

    // Altera o valor do name para um valor inválido
    fireEvent.change(screen.getByPlaceholderText("Ex: Mestre"), {
      target: { value: "abc" },
    });

    // Altera o valor do pointsRequired para um valor válido
    fireEvent.change(screen.getByPlaceholderText("Ex: 10"), {
      target: { value: "a" },
    });

    // Submete o formulário
    fireEvent.submit(screen.getByTestId("edit-level-form"));

    // Verifica se o toast de erro foi chamado
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "A quantidade de pontos necessários deve ser maior que 0 (zero)"
      );
    });
  });

  test("should submit the form successfully if inputs are valid", async () => {
    (LevelsAPI.update as jest.Mock).mockResolvedValue({ ok: true });

    render(<EditLevelButtonDialog level={mockLevel} />);

    fireEvent.click(screen.getByTitle("Editar level"));

    // Altera o valor do name para um valor inválido
    fireEvent.change(screen.getByPlaceholderText("Ex: Mestre"), {
      target: { value: "abc" },
    });

    // Altera o valor do pointsRequired para um valor válido
    fireEvent.change(screen.getByPlaceholderText("Ex: 10"), {
      target: { value: 10 },
    });

    // Submete o formulário
    fireEvent.submit(screen.getByTestId("edit-level-form"));

    // Verifica se o serviço foi chamado com os dados corretos
    await waitFor(() => {
      expect(LevelsAPI.update).toHaveBeenCalledWith(mockLevel.id, {
        name: "abc",
        pointsRequired: 10,
      });

      // Verifica se o toast de sucesso foi chamado
      expect(toast.success).toHaveBeenCalledWith(
        "Level atualizado com sucesso!"
      );
    });
  });

  test("should show an error if the API call fails", async () => {
    (LevelsAPI.update as jest.Mock).mockResolvedValue({ ok: false });

    render(<EditLevelButtonDialog level={mockLevel} />);

    fireEvent.click(screen.getByTitle("Editar level"));

    // Altera o valor do name para um valor inválido
    fireEvent.change(screen.getByPlaceholderText("Ex: Mestre"), {
      target: { value: "abc" },
    });

    // Altera o valor do pointsRequired para um valor válido
    fireEvent.change(screen.getByPlaceholderText("Ex: 10"), {
      target: { value: 10 },
    });

    // Submete o formulário
    fireEvent.submit(screen.getByTestId("edit-level-form"));

    // Verifica se o serviço foi chamado com os dados corretos
    await waitFor(() => {
      expect(LevelsAPI.update).toHaveBeenCalledWith(mockLevel.id, {
        name: "abc",
        pointsRequired: 10,
      });

      expect(toast.error).toHaveBeenCalled(); // handleError deve exibir um erro
    });
  });

  // test("should show an error if level does not exist", async () => {
  //   const invalidLevel = undefined as unknown as ILevel; // Modifica o ID para simular um usuário inválido

  //   render(<EditLevelButtonDialog level={invalidLevel} />);

  //   fireEvent.click(screen.getByTitle("Editar level"));

  //   // Altera o valor do name para um valor inválido
  //   fireEvent.change(screen.getByPlaceholderText("Ex: Mestre"), {
  //     target: { value: "abc" },
  //   });

  //   // Altera o valor do pointsRequired para um valor válido
  //   fireEvent.change(screen.getByPlaceholderText("Ex: 10"), {
  //     target: { value: 10 },
  //   });

  //   // Submete o formulário
  //   fireEvent.submit(screen.getByTestId("edit-level-form"));

  //   expect(toast.error).not.toHaveBeenCalled();
  //   expect(toast.success).not.toHaveBeenCalled();
  //   expect(LevelsAPI.update).not.toHaveBeenCalled();
  // });
});
