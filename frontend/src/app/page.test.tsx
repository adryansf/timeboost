/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import Page from "./page";

it("Home Page", () => {
  render(<Page />);
  expect(screen.getByTestId("p-hello")).toHaveTextContent(
    "Seja bem-vindo ao Timeboost, a sua aplicação de gestão de tempo!"
  );
});
