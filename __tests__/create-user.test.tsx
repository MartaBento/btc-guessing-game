import CreateUser from "@/components/pages/create-user";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

describe("CreateUser Component", () => {
  const mockPush = jest.fn();
  const mockFetch = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    global.fetch = mockFetch;

    mockPush.mockClear();
    mockFetch.mockClear();
  });

  test("Renders the CreateUser component correctly", () => {
    render(<CreateUser />);

    expect(screen.getByText("BTC Guessing Game")).toBeInTheDocument();
    expect(
      screen.getByText("Let's create your account. 🚀")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("First name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Your password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Create new account/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Login here")).toBeInTheDocument();
  });

  test("Allows form input and submission", async () => {
    render(<CreateUser />);

    fireEvent.change(screen.getByLabelText("First name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Your password"), {
      target: { value: "Password123!" },
    });

    expect(screen.getByLabelText("First name")).toHaveValue("John");
    expect(screen.getByLabelText("Email")).toHaveValue("john@example.com");
    expect(screen.getByLabelText("Your password")).toHaveValue("password123");

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    fireEvent.click(
      screen.getByRole("button", { name: /Create new account/i })
    );

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "John, your account was created successfully. Redirecting to login..."
      );
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  test("Displays validation errors based on the created schema on invalid input", async () => {
    render(<CreateUser />);

    fireEvent.click(
      screen.getByRole("button", { name: /Create new account/i })
    );

    await waitFor(() => {
      expect(screen.getByText("First name is required.")).toBeInTheDocument();
      expect(screen.getByText("Invalid email address.")).toBeInTheDocument();
      expect(
        screen.getByText("Password must be at least 8 characters.")
      ).toBeInTheDocument();
    });
  });

  test("Handles gracefully the submission errors on the screen", async () => {
    render(<CreateUser />);

    fireEvent.change(screen.getByLabelText("First name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Your password"), {
      target: { value: "password123" },
    });

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Something went wrong" }),
    });

    fireEvent.click(
      screen.getByRole("button", { name: /Create new account/i })
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Something went wrong");
    });
  });
});
