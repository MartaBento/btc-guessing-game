import "@testing-library/jest-dom";
import Input from "@/components/common/input";
import { render, screen, fireEvent } from "@testing-library/react";

describe("Input Component", () => {
  test("Renders input correctly with label description", () => {
    render(
      <Input
        label="name"
        labelDescription="Name"
        type="text"
        placeholder="Your name"
      />
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
  });

  test("Toggles input type for password", () => {
    render(
      <Input
        label="password"
        labelDescription="Password"
        type="password"
        placeholder="Your password"
      />
    );

    const inputElement = screen.getByPlaceholderText("Your password");
    expect(inputElement).toHaveAttribute("type", "password");
    fireEvent.click(screen.getByText("Show"));
    expect(inputElement).toHaveAttribute("type", "text");
    fireEvent.click(screen.getByText("Hide"));
    expect(inputElement).toHaveAttribute("type", "password");
  });

  test("Displays error message correctly", () => {
    const errorMessage = "Invalid email";

    render(
      <Input
        label="email"
        labelDescription="Email address"
        type="email"
        placeholder="Your email address"
        error={errorMessage}
      />
    );
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test("Displays correct placeholder", () => {
    const placeholderText = "Your email address";

    render(
      <Input
        label="email"
        labelDescription="Email address"
        type="email"
        placeholder={placeholderText}
      />
    );
    expect(screen.getByPlaceholderText(placeholderText)).toBeInTheDocument();
  });

  test("Sets autoComplete attribute correctly", () => {
    const autoCompleteValue = "email";

    render(
      <Input
        label="email"
        labelDescription="Email"
        type="email"
        placeholder="Your email address"
        autoComplete={autoCompleteValue}
      />
    );

    expect(screen.getByPlaceholderText("Your email address")).toHaveAttribute(
      "autocomplete",
      autoCompleteValue
    );
  });
});
