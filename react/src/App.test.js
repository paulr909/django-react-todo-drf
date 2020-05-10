import React from "react";
import { render } from "@testing-library/react";
import ClassApp from "./App";

test("renders learn react link", () => {
  const { getByText } = render(<ClassApp />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
