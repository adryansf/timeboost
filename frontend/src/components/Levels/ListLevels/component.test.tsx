import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ListLevels from ".";
import LevelsAPI, { ILevel } from "../../../services/levels";
import { handleError } from "../../../errors/handleError";

// Mock do serviço de usuários, handleError e react
jest.mock("../../../services/levels");
jest.mock("../../../errors/handleError", () => ({
  handleError: jest.fn(),
}));

describe("ListLevels Component", () => {
  let mockLevels: ILevel[] = [
    {
      id: 1,
      name: "Iniciante",
      pointsRequired: 0,
    },
    {
      id: 2,
      name: "Médio",
      pointsRequired: 10,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render user list correctly", async () => {
    (LevelsAPI.getAll as jest.Mock).mockResolvedValue({
      ok: true,
      data: mockLevels,
    });

    render(<ListLevels />);

    // Verifica se o loader está presente inicialmente
    expect(screen.getByTestId("loader")).toBeInTheDocument();

    // Aguarda os usuários serem carregados
    await waitFor(() => {
      expect(screen.getByText(mockLevels[0].name)).toBeInTheDocument();
      expect(screen.getByText(mockLevels[1].name)).toBeInTheDocument();
    });
  });

  test("should call API and handle error on failure", async () => {
    (LevelsAPI.getAll as jest.Mock).mockResolvedValue({
      ok: false,
    });

    render(<ListLevels />);

    // Aguarda o carregamento e verifica se o handleError foi chamado
    await waitFor(() => {
      expect(handleError).toHaveBeenCalled();
    });

    // Verifica se a mensagem de erro é exibida
    expect(screen.queryByText(mockLevels[0].name)).not.toBeInTheDocument();
  });

  test("should refresh the user list when the refresh button is clicked", async () => {
    (LevelsAPI.getAll as jest.Mock).mockResolvedValue({
      ok: true,
      data: mockLevels,
    });

    render(<ListLevels />);

    // Aguarda os usuários serem carregados
    await waitFor(() => {
      expect(screen.getByText(mockLevels[0].name)).toBeInTheDocument();
    });

    // Clica no botão de recarregar
    const refreshButton = screen.getByTestId("refresh-button");
    fireEvent.click(refreshButton);

    // Verifica se a função de recarregar foi chamada
    await waitFor(() => {
      expect(LevelsAPI.getAll).toHaveBeenCalledTimes(2);
    });
  });
});
