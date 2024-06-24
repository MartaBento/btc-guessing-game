import "@testing-library/jest-dom";
import Button from "@/components/common/button";
import { render, screen, fireEvent } from "@testing-library/react";

describe("Button Component", () => {
  const mockOnClick = jest.fn();

  test("Renders button correctly with label", () => {
    render(<Button label="Continue" />);

    expect(screen.getByText("Continue")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  test("Calls onClick handler correctly", () => {
    render(<Button label="Continue" onClick={mockOnClick} />);

    fireEvent.click(screen.getByText("Continue"));
    expect(mockOnClick).toHaveBeenCalled();
  });

  test("Sets aria-label attribute correctly", () => {
    render(<Button label="Continue" ariaLabel="Continue" />);

    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      "Continue"
    );
  });

  test("Button is disabled when isDisabled prop is true", () => {
    render(<Button label="Continue" isDisabled />);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  test("Button shows loading state when isLoading prop is true", () => {
    render(<Button label="Click Me" isLoading />);
    const button = screen.getByRole("button");

    expect(button).toHaveClass("animate-pulse");
    expect(button).toBeDisabled();
  });

  test("Renders button with icon on the left", () => {
    render(<Button label="Edit" icon="📝" iconPosition="left" />);

    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("📝")).toBeInTheDocument();
  });

  test("Renders button with icon on the right", () => {
    render(<Button label="Edit" icon="📝" iconPosition="right" />);

    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("📝")).toBeInTheDocument();
  });
});
