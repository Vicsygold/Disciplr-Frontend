import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  clampProgressValue,
  VaultProgressBar,
} from "../../components/VaultProgressBar";

describe("clampProgressValue", () => {
  it("clamps progress values to the 0-100 range", () => {
    expect(clampProgressValue(-5)).toBe(0);
    expect(clampProgressValue(42)).toBe(42);
    expect(clampProgressValue(120)).toBe(100);
    expect(clampProgressValue(Number.NaN)).toBe(0);
  });
});

describe("VaultProgressBar", () => {
  it("renders accessible progressbar semantics", () => {
    render(<VaultProgressBar value={42} label="Funding progress" />);

    const progressbar = screen.getByRole("progressbar", {
      name: "Funding progress",
    });
    expect(progressbar).toHaveAttribute("aria-valuemin", "0");
    expect(progressbar).toHaveAttribute("aria-valuemax", "100");
    expect(progressbar).toHaveAttribute("aria-valuenow", "42");
    expect(progressbar).toHaveAttribute("aria-valuetext", "42%");
    expect(screen.getByText("Funding progress")).toBeInTheDocument();
    expect(screen.getByText("42%")).toBeInTheDocument();
  });

  it("uses the default label when no label is provided", () => {
    render(<VaultProgressBar value={25} />);

    expect(
      screen.getByRole("progressbar", { name: "Vault progress" }),
    ).toBeInTheDocument();
  });

  it("clamps visual and ARIA values", () => {
    const { rerender } = render(<VaultProgressBar value={120} />);

    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100",
    );
    expect(screen.getByText("100%")).toBeInTheDocument();

    rerender(<VaultProgressBar value={-5} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "0",
    );
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("can hide the visible label while preserving the ARIA label", () => {
    render(
      <VaultProgressBar
        value={64.25}
        label="Timeline progress"
        showValue={false}
      />,
    );

    expect(
      screen.getByRole("progressbar", { name: "Timeline progress" }),
    ).toHaveAttribute("aria-valuetext", "64.3%");
    expect(screen.queryByText("Timeline progress")).not.toBeInTheDocument();
  });
});
