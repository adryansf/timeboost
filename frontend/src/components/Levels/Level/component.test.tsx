import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Level from ".";
import LevelsAPI, { ILevel } from "../../../services/levels";
import { toast } from "react-toastify";

// Mock do serviço de deleção de usuários e do toast
jest.mock("../../../services/levels");
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe("Level Component", () => {
  const mockLevel: ILevel = {
    id: 1,
    name: "Iniciante",
    pointsRequired: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render user information correctly", () => {
    render(<Level level={mockLevel} />);

    // Verifica se o id, name e pointsRequired estão sendo exibidos corretamente
    expect(screen.getByText(mockLevel.id)).toBeInTheDocument();
    expect(screen.getByText(mockLevel.name)).toBeInTheDocument();
    expect(screen.getByText(mockLevel.pointsRequired)).toBeInTheDocument();
  });

  test("should call delete API and show success toast on successful deletion", async () => {
    (LevelsAPI.delete as jest.Mock).mockResolvedValue({ ok: true });

    render(<Level level={mockLevel} />);

    // Clica no botão de deletar
    fireEvent.click(screen.getByTitle("Deletar level"));

    // Verifica se a função de deleção foi chamada com o ID correto
    await waitFor(() => {
      expect(LevelsAPI.delete).toHaveBeenCalledWith(mockLevel.id);
    });

    // Verifica se o toast de sucesso foi chamado
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Level deletado com sucesso!");
    });
  });

  test("should show error toast if delete API call fails", async () => {
    (LevelsAPI.delete as jest.Mock).mockResolvedValue({ ok: false });

    render(<Level level={mockLevel} />);

    // Clica no botão de deletar
    fireEvent.click(screen.getByTitle("Deletar level"));

    // Verifica se a função de deleção foi chamada com o ID correto
    await waitFor(() => {
      expect(LevelsAPI.delete).toHaveBeenCalledWith(mockLevel.id);
    });

    // Verifica se o toast de erro foi chamado
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled(); // handleError exibe um erro
    });
  });

  test("should render EditLevelButtonDialog component", () => {
    render(<Level level={mockLevel} />);

    // Verifica se o botão de editar level está presente
    const editButton = screen.getByTitle("Editar level");
    expect(editButton).toBeInTheDocument();
  });
});
