import { render, screen, fireEvent } from "@testing-library/react";
import SearchUserArea from ".";
import { Dispatch, SetStateAction } from "react";

describe("SearchUserArea", () => {
  let setSearchUsernameMock: Dispatch<SetStateAction<string>>;

  beforeEach(() => {
    setSearchUsernameMock = jest.fn(); // Mock da função setSearchUsername
  });

  it("should render the input field and the search button", () => {
    render(<SearchUserArea setSearchUsername={setSearchUsernameMock} />);

    // Verificar se o campo de input está na tela
    const inputElement = screen.getByPlaceholderText("Username");
    expect(inputElement).toBeInTheDocument();

    // Verificar se o botão de busca está na tela
    const buttonElement = screen.getByTitle("Buscar usuário por username");
    expect(buttonElement).toBeInTheDocument();
  });

  it("should call setSearchUsername with the input value when clicking the button", () => {
    render(<SearchUserArea setSearchUsername={setSearchUsernameMock} />);

    const inputElement = screen.getByPlaceholderText(
      "Username"
    ) as HTMLInputElement;
    const buttonElement = screen.getByTitle("Buscar usuário por username");

    // Simular digitação no input
    fireEvent.change(inputElement, { target: { value: "adryan" } });

    // Clicar no botão de busca
    fireEvent.click(buttonElement);

    // Verificar se setSearchUsername foi chamado com o valor correto
    expect(setSearchUsernameMock).toHaveBeenCalledWith("adryan");
  });

  it("should call setSearchUsername with an empty string if the input is empty when clicking the button", () => {
    render(<SearchUserArea setSearchUsername={setSearchUsernameMock} />);

    const buttonElement = screen.getByTitle("Buscar usuário por username");

    // Clicar no botão de busca sem digitar nada no input
    fireEvent.click(buttonElement);

    // Verificar se setSearchUsername foi chamado com uma string vazia
    expect(setSearchUsernameMock).toHaveBeenCalledWith("");
  });
});
