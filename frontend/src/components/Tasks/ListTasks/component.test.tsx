import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ListTasks from ".";
import TasksAPI, { ITask } from "../../../services/tasks";
import { handleError } from "../../../errors/handleError";

// Mocks
jest.mock("../../../services/tasks");
jest.mock("../../../errors/handleError", () => ({
  handleError: jest.fn(),
}));

describe("ListTasks Component", () => {
  const mockTasks: ITask[] = [
    {
      id: 1,
      completed: true,
      description: "Lorem Ipsum",
      idUser: "acde070d-8c4c-4f0d-9d8a-162843c10333",
      dueDate: new Date().toISOString(),
      title: "Tarefa 1",
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      completed: false,
      description: "Lorem Ipsum",
      idUser: "acde070d-8c4c-4f0d-9d8a-162843c10333",
      dueDate: new Date().toISOString(),
      title: "Tarefa 2",
      createdAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render tasks list correctly", async () => {
    (TasksAPI.getAll as jest.Mock).mockResolvedValue({
      ok: true,
      data: mockTasks,
    });

    render(<ListTasks />);

    // Verifica se o loader está presente inicialmente
    expect(screen.getByTestId("loader")).toBeInTheDocument();

    // Aguarda as tasks serem carregados
    await waitFor(() => {
      expect(screen.getByText("Tarefa 1")).toBeInTheDocument();
      expect(screen.getByText("Tarefa 2")).toBeInTheDocument();
    });
  });

  test("should call API and handle error on failure", async () => {
    (TasksAPI.getAll as jest.Mock).mockResolvedValue({
      ok: false,
    });

    render(<ListTasks />);

    // Aguarda o carregamento e verifica se o handleError foi chamado
    await waitFor(() => {
      expect(handleError).toHaveBeenCalled();
    });

    // Verifica se a mensagem de erro é exibida
    expect(screen.queryByText("Tarefa 1")).not.toBeInTheDocument();
  });

  test("should refresh the task list when the refresh button is clicked", async () => {
    (TasksAPI.getAll as jest.Mock).mockResolvedValue({
      ok: true,
      data: mockTasks,
    });

    render(<ListTasks />);

    // Aguarda as tarefas serem carregados
    await waitFor(() => {
      expect(screen.getByText("Tarefa 1")).toBeInTheDocument();
    });

    // Clica no botão de recarregar
    const refreshButton = screen.getByTestId("refresh-button");
    fireEvent.click(refreshButton);

    // Verifica se a função de recarregar foi chamada
    await waitFor(() => {
      expect(TasksAPI.getAll).toHaveBeenCalledTimes(2);
    });
  });
});
