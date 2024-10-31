import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateTaskButtonDialog from ".";
import TasksAPI from "../../../services/tasks";
import { toast } from "react-toastify";

jest.mock("../../../services/tasks");
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe("CreateTaskButtonDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the button to open the dialog", () => {
    render(<CreateTaskButtonDialog />);

    const openButton = screen.getByTitle("Adicionar Tarefa");
    expect(openButton).toBeInTheDocument();
  });

  it("should open the dialog when the button is clicked", async () => {
    render(<CreateTaskButtonDialog />);

    const openButton = screen.getByTitle("Adicionar Tarefa");
    fireEvent.click(openButton);

    const dialog = await screen.findByTestId("create-task-dialog");
    expect(dialog).toHaveAttribute("data-open", "true");
  });

  it("should close the dialog when the close button is clicked", async () => {
    render(<CreateTaskButtonDialog />);

    const openButton = screen.getByTitle("Adicionar Tarefa");
    fireEvent.click(openButton);

    const closeButton = screen.getByTitle("Fechar");
    fireEvent.click(closeButton);

    const dialog = await screen.findByTestId("create-task-dialog");
    expect(dialog).toHaveAttribute("data-open", "false");
  });

  it("should show an error if title is too short", async () => {
    render(<CreateTaskButtonDialog />);

    const openButton = screen.getByTitle("Adicionar Tarefa");
    fireEvent.click(openButton);

    const titleInput = screen.getByPlaceholderText(
      "Ex: Estudar para a prova de testes"
    );
    const descriptionInput = screen.getByPlaceholderText(
      "Ex: Revisar os capítulos 5, 6 e 7 do livro."
    );
    const dueDateInput = screen.getByPlaceholderText("DD/MM/YYYY");
    const idUserInput = screen.getByPlaceholderText(
      "Ex: acde070d-8c4c-4f0d-9d8a-162843c10333"
    );
    const submitButton = screen.getByText("Criar");

    fireEvent.change(titleInput, { target: { value: "ab" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Lorem Ipsum Lorem Ipsum" },
    });
    fireEvent.change(dueDateInput, { target: { value: "09112001" } });
    fireEvent.change(idUserInput, {
      target: { value: "acde070d-8c4c-4f0d-9d8a-162843c10333" },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "O título deve ter no mínimo 3 caracteres"
      );
    });
  });

  it("should show an error if description is too short", async () => {
    render(<CreateTaskButtonDialog />);

    const openButton = screen.getByTitle("Adicionar Tarefa");
    fireEvent.click(openButton);

    const titleInput = screen.getByPlaceholderText(
      "Ex: Estudar para a prova de testes"
    );
    const descriptionInput = screen.getByPlaceholderText(
      "Ex: Revisar os capítulos 5, 6 e 7 do livro."
    );
    const dueDateInput = screen.getByPlaceholderText("DD/MM/YYYY");
    const idUserInput = screen.getByPlaceholderText(
      "Ex: acde070d-8c4c-4f0d-9d8a-162843c10333"
    );
    const submitButton = screen.getByText("Criar");

    fireEvent.change(titleInput, { target: { value: "abcd" } });
    fireEvent.change(descriptionInput, { target: { value: "Lorem" } });
    fireEvent.change(dueDateInput, { target: { value: "09/11/2001" } });
    fireEvent.change(idUserInput, {
      target: { value: "acde070d-8c4c-4f0d-9d8a-162843c10333" },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "A descrição deve ter no mínimo 10 caracteres"
      );
    });
  });

  it("should show an error if dueDate not completed", async () => {
    render(<CreateTaskButtonDialog />);

    const openButton = screen.getByTitle("Adicionar Tarefa");
    fireEvent.click(openButton);

    const titleInput = screen.getByPlaceholderText(
      "Ex: Estudar para a prova de testes"
    );
    const descriptionInput = screen.getByPlaceholderText(
      "Ex: Revisar os capítulos 5, 6 e 7 do livro."
    );
    const dueDateInput = screen.getByPlaceholderText("DD/MM/YYYY");
    const idUserInput = screen.getByPlaceholderText(
      "Ex: acde070d-8c4c-4f0d-9d8a-162843c10333"
    );
    const submitButton = screen.getByText("Criar");

    fireEvent.change(titleInput, { target: { value: "abcd" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Lorem Ipsum Lorem Ipsum" },
    });
    fireEvent.change(dueDateInput, { target: { value: "09/11/200" } });
    fireEvent.change(idUserInput, {
      target: { value: "acde070d-8c4c-4f0d-9d8a-162843c10333" },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "A data de vencimento deve ser definida."
      );
    });
  });

  it("should show an error if idUser not valid", async () => {
    render(<CreateTaskButtonDialog />);

    const openButton = screen.getByTitle("Adicionar Tarefa");
    fireEvent.click(openButton);

    const titleInput = screen.getByPlaceholderText(
      "Ex: Estudar para a prova de testes"
    );
    const descriptionInput = screen.getByPlaceholderText(
      "Ex: Revisar os capítulos 5, 6 e 7 do livro."
    );
    const dueDateInput = screen.getByPlaceholderText("DD/MM/YYYY");
    const idUserInput = screen.getByPlaceholderText(
      "Ex: acde070d-8c4c-4f0d-9d8a-162843c10333"
    );
    const submitButton = screen.getByText("Criar");

    fireEvent.change(titleInput, { target: { value: "abcd" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Lorem Ipsum Lorem Ipsum" },
    });
    fireEvent.change(dueDateInput, { target: { value: "2001-11-09" } });
    fireEvent.change(idUserInput, { target: { value: "a" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Digite o id do usuário.");
    });
  });

  it("should show a success message when the user is created successfully", async () => {
    (TasksAPI.create as jest.Mock).mockResolvedValue({ ok: true });

    render(<CreateTaskButtonDialog />);

    const openButton = screen.getByTitle("Adicionar Tarefa");
    fireEvent.click(openButton);

    const titleInput = screen.getByPlaceholderText(
      "Ex: Estudar para a prova de testes"
    );
    const descriptionInput = screen.getByPlaceholderText(
      "Ex: Revisar os capítulos 5, 6 e 7 do livro."
    );
    const dueDateInput = screen.getByPlaceholderText("DD/MM/YYYY");
    const idUserInput = screen.getByPlaceholderText(
      "Ex: acde070d-8c4c-4f0d-9d8a-162843c10333"
    );
    const submitButton = screen.getByText("Criar");

    fireEvent.change(titleInput, { target: { value: "abc" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Lorem Ipsum Lorem Ipsum" },
    });
    fireEvent.change(dueDateInput, { target: { value: "2001-11-09" } });
    fireEvent.change(idUserInput, {
      target: { value: "acde070d-8c4c-4f0d-9d8a-162843c10333" },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Tarefa criada com sucesso!");
    });
  });

  it("should handle API errors correctly", async () => {
    const errorResponse = {
      ok: false,
      message: "Erro ao criar tarefa",
      statusCode: 400,
    };
    (TasksAPI.create as jest.Mock).mockResolvedValue(errorResponse);

    render(<CreateTaskButtonDialog />);

    const openButton = screen.getByTitle("Adicionar Tarefa");
    fireEvent.click(openButton);

    const titleInput = screen.getByPlaceholderText(
      "Ex: Estudar para a prova de testes"
    );
    const descriptionInput = screen.getByPlaceholderText(
      "Ex: Revisar os capítulos 5, 6 e 7 do livro."
    );
    const dueDateInput = screen.getByPlaceholderText("DD/MM/YYYY");
    const idUserInput = screen.getByPlaceholderText(
      "Ex: acde070d-8c4c-4f0d-9d8a-162843c10333"
    );
    const submitButton = screen.getByText("Criar");

    fireEvent.change(titleInput, { target: { value: "abc" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Lorem Ipsum Lorem Ipsum" },
    });
    fireEvent.change(dueDateInput, { target: { value: "2001-11-09" } });
    fireEvent.change(idUserInput, {
      target: { value: "acde070d-8c4c-4f0d-9d8a-162843c10333" },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Erro ao criar tarefa");
    });
  });
});
