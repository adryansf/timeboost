import { render, screen, fireEvent } from "@testing-library/react";
import NavItem from "@/components/NavItem";
import { HomeIcon } from "lucide-react";
import "@testing-library/jest-dom";

describe("NavItem component", () => {
  test("renders the nav item with icon and name", () => {
    render(<NavItem to="/" icon={HomeIcon} name="Início" />);

    const element = screen.getByText("Início");
    const iconElement = screen.getByRole("nav-item-icon");
    const linkElement = screen.getByRole("nav-item-link");

    // Verifica se o ícone e o nome estão sendo renderizados
    expect(element).toBeInTheDocument();
    expect(iconElement).toBeInTheDocument();
    expect(linkElement).toBeInTheDocument();
  });

  test("applies active styles when active is true", () => {
    render(<NavItem to="/" icon={HomeIcon} name="Início" active={true} />);

    const linkElement = screen.getByRole("nav-item-link");
    // Verifica se o link tem o atributo data-active="true"
    expect(linkElement).toHaveAttribute("data-active", "true");
  });

  test("does not apply active styles when active is false", () => {
    render(<NavItem to="/" icon={HomeIcon} name="Início" active={false} />);

    const linkElement = screen.getByRole("nav-item-link");
    // Verifica se o link tem o atributo data-active="false"
    expect(linkElement).toHaveAttribute("data-active", "false");
  });

  test("verify if href will navigates to the correct link", async () => {
    render(<NavItem to="/usuarios" icon={HomeIcon} name="Usuários" />);

    const linkElement = screen.getByRole("nav-item-link");

    expect(linkElement).toHaveAttribute("href", "/usuarios");
  });
});
