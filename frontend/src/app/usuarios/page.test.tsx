import { render, screen, fireEvent } from "@testing-library/react";
import Users from "./page";

describe("Users", () => {
  it("should render SearchUserArea, CreateUserButtonDialog, and ListUsers components", () => {
    render(<Users />);

    // Check if SearchUserArea is displayed
    const searchInput = screen.getByPlaceholderText("Username");
    expect(searchInput).toBeInTheDocument();

    // Check if the create user button is displayed
    const createUserButton = screen.getByRole("button", {
      name: "Adicionar Usuário",
    });
    expect(createUserButton).toBeInTheDocument();

    // Check if the ListUsers component is displayed
    const usersListHeader = screen.getByText("Usuários");
    expect(usersListHeader).toBeInTheDocument();
  });

  it("should update the search state when a new username is typed and the search button is clicked", () => {
    render(<Users />);

    // Get the input field and search button
    const searchInput = screen.getByPlaceholderText("Username");
    const searchButton = screen.getByTitle("Buscar usuário por username");

    // Simulate typing a username into the search field
    fireEvent.change(searchInput, { target: { value: "adryan" } });

    // Simulate clicking the search button
    fireEvent.click(searchButton);

    // Verify that the input value is as expected
    expect(searchInput).toHaveValue("adryan");
  });
});
