import { screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "@/components/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import { render } from "@/test/utils";

// Mock the useAuth hook
jest.mock("@/hooks/useAuth");
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe("LoginForm", () => {
  const mockLogin = jest.fn();
  const mockOnSwitchToRegister = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      isLoginLoading: false,
      loginError: null,
      register: jest.fn(),
      logout: jest.fn(),
      user: null,
      token: null,
      isAuthenticated: false,
      isRegisterLoading: false,
      registerError: null,
    });
  });

  it("should render login form correctly", () => {
    render(<LoginForm />);

    expect(screen.getByText("ResQ Console")).toBeInTheDocument();
    expect(
      screen.getByText("Connectez-vous pour accéder au système de dispatch")
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/adresse email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /se connecter/i })
    ).toBeInTheDocument();
  });

  it("should show validation errors for empty fields", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const submitButton = screen.getByRole("button", { name: /se connecter/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/l'email est requis/i)).toBeInTheDocument();
      expect(
        screen.getByText(/le mot de passe est requis/i)
      ).toBeInTheDocument();
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("should show validation error for invalid email", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/adresse email/i);
    const submitButton = screen.getByRole("button", { name: /se connecter/i });

    await user.type(emailInput, "invalid-email");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email invalide/i)).toBeInTheDocument();
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("should submit form with valid data", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/adresse email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole("button", { name: /se connecter/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("should show loading state when submitting", () => {
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      isLoginLoading: true,
      loginError: null,
      register: jest.fn(),
      logout: jest.fn(),
      user: null,
      token: null,
      isAuthenticated: false,
      isRegisterLoading: false,
      registerError: null,
    });

    render(<LoginForm />);

    const submitButton = screen.getByRole("button", { name: /connexion/i });
    expect(submitButton).toBeDisabled();
  });

  it("should show login error", () => {
    const errorMessage = "Invalid credentials";
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      isLoginLoading: false,
      loginError: errorMessage,
      register: jest.fn(),
      logout: jest.fn(),
      user: null,
      token: null,
      isAuthenticated: false,
      isRegisterLoading: false,
      registerError: null,
    });

    render(<LoginForm />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("should call onSwitchToRegister when register link is clicked", async () => {
    const user = userEvent.setup();
    render(<LoginForm onSwitchToRegister={mockOnSwitchToRegister} />);

    const registerLink = screen.getByText(/créer un compte/i);
    await user.click(registerLink);

    expect(mockOnSwitchToRegister).toHaveBeenCalledTimes(1);
  });

  it("should handle keyboard navigation", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/adresse email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);

    await user.click(emailInput);
    await user.keyboard("{Tab}");

    expect(passwordInput).toHaveFocus();
  });
});
