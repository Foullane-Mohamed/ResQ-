import { screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/Button";
import { render } from "@/test/utils";
import { User } from "lucide-react";

describe("Button", () => {
  it("should render button with text", () => {
    render(<Button>Click me</Button>);

    expect(
      screen.getByRole("button", { name: /click me/i })
    ).toBeInTheDocument();
  });

  it("should render with different variants", () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-red-600");

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-gray-200");

    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-red-600");

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-transparent");
  });

  it("should render with different sizes", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button")).toHaveClass("px-3", "py-1.5", "text-sm");

    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByRole("button")).toHaveClass("px-4", "py-2", "text-base");

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button")).toHaveClass("px-6", "py-3", "text-lg");
  });

  it("should handle click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled:opacity-50");
  });

  it("should show loading state", () => {
    render(<Button loading>Loading</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("should render with icon", () => {
    render(<Button icon={User}>With Icon</Button>);

    expect(screen.getByRole("button")).toBeInTheDocument();
    // Icon should be rendered as SVG
    expect(screen.getByRole("button").querySelector("svg")).toBeInTheDocument();
  });

  it("should not call onClick when loading", () => {
    const handleClick = jest.fn();
    render(
      <Button loading onClick={handleClick}>
        Loading
      </Button>
    );

    fireEvent.click(screen.getByRole("button"));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should apply custom className", () => {
    render(<Button className="custom-class">Custom</Button>);

    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("should forward ref correctly", () => {
    const ref = jest.fn();
    render(<Button ref={ref}>Ref Test</Button>);

    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });

  it("should support all button HTML attributes", () => {
    render(
      <Button
        type="submit"
        form="test-form"
        data-testid="custom-button"
        aria-label="Custom button"
      >
        Submit
      </Button>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toHaveAttribute("form", "test-form");
    expect(button).toHaveAttribute("data-testid", "custom-button");
    expect(button).toHaveAttribute("aria-label", "Custom button");
  });

  it("should handle keyboard events", () => {
    const handleKeyDown = jest.fn();
    render(<Button onKeyDown={handleKeyDown}>Keyboard Test</Button>);

    const button = screen.getByRole("button");
    fireEvent.keyDown(button, { key: "Enter" });

    expect(handleKeyDown).toHaveBeenCalledWith(
      expect.objectContaining({ key: "Enter" })
    );
  });
});
