import { render, screen, fireEvent } from "@testing-library/react";
import Tasks from "./page";

describe("Tasks", () => {
  it("should render CreateTaskButtonDialog, and ListTasks components", () => {
    render(<Tasks />);

    // Check if the create Task button is displayed
    const createTaskButton = screen.getByRole("button", {
      name: "Adicionar Tarefa",
    });
    expect(createTaskButton).toBeInTheDocument();

    // Check if the ListTasks component is displayed
    const TasksListHeader = screen.getByText("Tarefas");
    expect(TasksListHeader).toBeInTheDocument();
  });
});
