import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ListUsers from ".";
import UsersAPI, { IUser, IUsersPagination } from "../../../services/users";
import { handleError } from "../../../errors/handleError";

// Mock do serviço de usuários e handleError
jest.mock("../../../services/users");
jest.mock("../../../errors/handleError", () => ({
  handleError: jest.fn(),
}));

describe("ListUsers Component", () => {
  const mockUsers: IUser[] = [
    {
      id: "1",
      username: "user1",
      email: "user1@example.com",
      createdAt: new Date(2023, 0, 1, 12, 0).toISOString(),
      updatedAt: new Date(2023, 0, 2, 15, 30).toISOString(),
      idLevel: 1,
    },
    {
      id: "2",
      username: "user2",
      email: "user2@example.com",
      createdAt: new Date(2023, 0, 3, 12, 0).toISOString(),
      updatedAt: new Date(2023, 0, 4, 15, 30).toISOString(),
      idLevel: 1,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render user list correctly", async () => {
    (UsersAPI.getAll as jest.Mock).mockResolvedValue({
      ok: true,
      data: {
        users: mockUsers,
        totalPages: 2,
        page: 1,
        totalUsers: 2,
        usersInPage: 2,
      } as IUsersPagination,
    });

    render(<ListUsers searchUsername="" />);

    // Verifica se o loader está presente inicialmente
    expect(screen.getByTestId("loader")).toBeInTheDocument();

    // Aguarda os usuários serem carregados
    await waitFor(() => {
      expect(screen.getByText("user1")).toBeInTheDocument();
      expect(screen.getByText("user2")).toBeInTheDocument();
    });

    // Verifica se a paginação é exibida corretamente
    expect(screen.getByText("Página 1 de 2")).toBeInTheDocument();
  });

  test("should call API and handle error on failure", async () => {
    (UsersAPI.getAll as jest.Mock).mockResolvedValue({
      ok: false,
    });

    render(<ListUsers searchUsername="" />);

    // Aguarda o carregamento e verifica se o handleError foi chamado
    await waitFor(() => {
      expect(handleError).toHaveBeenCalled();
    });

    // Verifica se a mensagem de erro é exibida
    expect(screen.queryByText("user1")).not.toBeInTheDocument();
  });

  test("should navigate to next and previous pages", async () => {
    (UsersAPI.getAll as jest.Mock).mockResolvedValue({
      ok: true,
      data: {
        users: mockUsers,
        totalPages: 2,
        page: 1,
        totalUsers: 2,
        usersInPage: 2,
      } as IUsersPagination,
    });

    render(<ListUsers searchUsername="" />);

    // Aguarda os usuários serem carregados
    await waitFor(() => {
      expect(screen.getByText("user1")).toBeInTheDocument();
    });

    // Verifica se o botão de próxima página está habilitado
    const nextPageButton = screen.getByTestId("next-button");
    fireEvent.click(nextPageButton);

    // Verifica se a função da API é chamada novamente para a próxima página
    await waitFor(() => {
      expect(UsersAPI.getAll).toHaveBeenCalledWith(2, "");
    });

    // Verifica se o botão de página anterior está habilitado
    const prevPageButton = screen.getByTestId("prev-button");
    fireEvent.click(prevPageButton);

    // Verifica se a função da API é chamada novamente para a página anterior
    await waitFor(() => {
      expect(UsersAPI.getAll).toHaveBeenCalledWith(1, "");
    });
  });

  test("should refresh the user list when the refresh button is clicked", async () => {
    (UsersAPI.getAll as jest.Mock).mockResolvedValue({
      ok: true,
      data: {
        users: mockUsers,
        totalPages: 2,
        page: 1,
        totalUsers: 2,
        usersInPage: 2,
      },
    });

    render(<ListUsers searchUsername="" />);

    // Aguarda os usuários serem carregados
    await waitFor(() => {
      expect(screen.getByText("user1")).toBeInTheDocument();
    });

    // Clica no botão de recarregar
    const refreshButton = screen.getByTestId("refresh-button");
    fireEvent.click(refreshButton);

    // Verifica se a função de recarregar foi chamada
    await waitFor(() => {
      expect(UsersAPI.getAll).toHaveBeenCalledTimes(2);
    });
  });
});
