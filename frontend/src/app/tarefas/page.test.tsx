import { render, screen, fireEvent } from "@testing-library/react";
import Levels from "./page";

describe("Levels", () => {
  it("should render CreateLevelButtonDialog, and ListLevels components", () => {
    render(<Levels />);

    // Check if the create level button is displayed
    const createLevelButton = screen.getByRole("button", {
      name: "Adicionar Tarefa",
    });
    expect(createLevelButton).toBeInTheDocument();

    // Check if the ListLevels component is displayed
    const LevelsListHeader = screen.getByText("Tarefas");
    expect(LevelsListHeader).toBeInTheDocument();
  });
});
