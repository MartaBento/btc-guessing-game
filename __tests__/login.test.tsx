import "@testing-library/jest-dom";
import Login from "@/components/pages/login";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { PAGES } from "@/constants/pages-apis-mapping";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

jest.mock("js-cookie", () => ({
  set: jest.fn(),
}));

describe("Login Component", () => {
  const mockPush = jest.fn();
  const mockFetch = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    global.fetch = mockFetch;

    mockPush.mockClear();
    mockFetch.mockClear();
    (Cookies.set as jest.Mock).mockClear();
  });

  test("Renders the Login component correctly", () => {
    render(<Login />);

    expect(screen.getByText("BTC Guessing Game")).toBeInTheDocument();
    expect(
      screen.getByText("Welcome! 👋🏻 Please login or create an account.")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByText("Create an account here")).toBeInTheDocument();
  });

  test("Allows form input and submission", async () => {
    render(<Login />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "Password123!" },
    });

    expect(screen.getByLabelText("Email")).toHaveValue("john@example.com");
    expect(screen.getByLabelText("Password")).toHaveValue("Password123!");

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ userId: 1 }),
    });

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(Cookies.set).toHaveBeenCalledWith(
        "userEmail",
        "john@example.com",
        { expires: 1 }
      );

      expect(Cookies.set).toHaveBeenCalledWith("userId", "1", { expires: 1 });
      expect(toast.success).toHaveBeenCalledWith(
        "Login successful. Redirecting..."
      );

      expect(mockPush).toHaveBeenCalledWith(PAGES.HOME);
    });
  });

  test("Displays validation errors on invalid input", async () => {
    render(<Login />);

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid email address.")).toBeInTheDocument();
      expect(
        screen.getByText("Password must be at least 8 characters.")
      ).toBeInTheDocument();
    });
  });

  test("Handles submission errors", async () => {
    render(<Login />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "Password123!" },
    });

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Something went wrong" }),
    });

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Something went wrong");
    });
  });
});
