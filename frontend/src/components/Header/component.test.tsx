import { render, screen } from "@testing-library/react";
import Header from "@/components/Header";
import { usePathname } from "next/navigation";
import "@testing-library/jest-dom";

// Mock do usePathname para simular a URL atual
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

// Mock do componente NavItem
jest.mock(
  "../NavItem",
  () =>
    ({
      icon,
      to,
      name,
      active,
    }: {
      icon: any;
      to: string;
      name: string;
      active: boolean;
    }) =>
      (
        <div data-testid={active ? "nav-item-mock-active" : "nav-item-mock"}>
          {name} {active ? "(active)" : ""}
        </div>
      )
);

describe("Header component", () => {
  beforeEach(() => {
    // Resetar mocks antes de cada teste
    jest.clearAllMocks();
  });

  test("renders logo and user avatar", () => {
    render(<Header />);

    // Verifica se o logo e o avatar estão renderizados
    const logo = screen.getByAltText("Timeboost");
    const avatar = screen.getByTestId("avatar");

    expect(logo).toBeInTheDocument();
    expect(avatar).toBeInTheDocument();
  });

  test("renders navigation items", () => {
    (usePathname as jest.Mock).mockReturnValue("/");

    render(<Header />);

    // Verifica se os itens de navegação são renderizados
    const navItemActive = screen.getByTestId("nav-item-mock-active");
    const navItems = screen.getAllByTestId("nav-item-mock");

    expect(navItemActive).toHaveTextContent("Início (active)");
    for (const navItem of navItems) {
      expect(navItem).toBeInTheDocument();
    }
  });

  test("marks the correct nav item as active based on the pathname", () => {
    (usePathname as jest.Mock).mockReturnValue("/usuarios");

    render(<Header />);

    // Verifica se o item correto está marcado como ativo
    const navItemActive = screen.getByTestId("nav-item-mock-active");
    expect(navItemActive).toHaveTextContent("Usuários (active)");
  });

  test("renders the logout button", () => {
    render(<Header />);

    // Verifica se o botão de logout está presente
    const logoutButton = screen.getByTestId("button-logout");
    expect(logoutButton).toBeInTheDocument();
  });
});
