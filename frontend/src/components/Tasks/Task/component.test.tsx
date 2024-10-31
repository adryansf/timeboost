import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Task from ".";
import TasksAPI, { ITask } from "../../../services/tasks";
import { toast } from "react-toastify";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

// Mock do serviço de deleção de usuários e do toast
jest.mock("../../../services/tasks");
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe("Task Component", () => {
  const mockTask: ITask = {
    id: 1,
    completed: false,
    description: "Lorem Ipsum",
    idUser: "acde070d-8c4c-4f0d-9d8a-162843c10333",
    dueDate: new Date().toISOString(),
    title: "Tarefa 1",
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render user information correctly", () => {
    render(<Task task={mockTask} />);

    // Verifica se o título e o IdUser estão sendo exibidos corretamente
    expect(screen.getByText(mockTask.title)).toBeInTheDocument();
    expect(screen.getByText(mockTask.idUser)).toBeInTheDocument();
  });

  test("should call delete API and show success toast on successful deletion", async () => {
    (TasksAPI.delete as jest.Mock).mockResolvedValue({ ok: true });

    render(<Task task={mockTask} />);

    // Clica no botão de deletar
    fireEvent.click(screen.getByTitle("Deletar tarefa"));

    // Verifica se a função de deleção foi chamada com o ID correto
    await waitFor(() => {
      expect(TasksAPI.delete).toHaveBeenCalledWith(mockTask.id);
    });

    // Verifica se o toast de sucesso foi chamado
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Tarefa deletada com sucesso!"
      );
    });
  });

  test("should show error toast if delete API call fails", async () => {
    (TasksAPI.delete as jest.Mock).mockResolvedValue({ ok: false });

    render(<Task task={mockTask} />);

    // Clica no botão de deletar
    fireEvent.click(screen.getByTitle("Deletar tarefa"));

    // Verifica se a função de deleção foi chamada com o ID correto
    await waitFor(() => {
      expect(TasksAPI.delete).toHaveBeenCalledWith(mockTask.id);
    });

    // Verifica se o toast de erro foi chamado
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled(); // handleError exibe um erro
    });
  });

  test("should call update API and show success toast on successful check", async () => {
    (TasksAPI.update as jest.Mock).mockResolvedValue({ ok: true });

    render(<Task task={mockTask} />);

    // Clica no botão de checar
    fireEvent.click(screen.getByTestId("task-check-button"));

    // Verifica se a função de deleção foi chamada com o ID correto
    await waitFor(() => {
      expect(TasksAPI.update).toHaveBeenCalledWith(mockTask.id, {
        completed: true,
      });
    });

    // Verifica se o toast de sucesso foi chamado
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Tarefada completada com sucesso!"
      );
    });
  });

  test("should show error toast if update API call fails", async () => {
    (TasksAPI.update as jest.Mock).mockResolvedValue({ ok: false });

    render(<Task task={mockTask} />);

    // Clica no botão de deletar
    fireEvent.click(screen.getByTestId("task-check-button"));

    // Verifica se a função de deleção foi chamada com o ID correto
    await waitFor(() => {
      expect(TasksAPI.update).toHaveBeenCalledWith(mockTask.id, {
        completed: true,
      });
    });

    // Verifica se o toast de erro foi chamado
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled(); // handleError exibe um erro
    });
  });

  test("should render Check Button component", () => {
    render(<Task task={mockTask} />);

    // Verifica se o botão de editar usuário está presente
    const checkButton = screen.getByTestId("task-check-button");
    expect(checkButton).toBeInTheDocument();
  });
});
