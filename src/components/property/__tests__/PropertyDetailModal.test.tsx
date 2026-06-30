import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PropertyDetailModal } from "../PropertyDetailModal";
import { properties } from "@/lib/data-utils";

describe("PropertyDetailModal", () => {
  it("renders the open property's detail as an accessible dialog", () => {
    const property = properties[0];
    render(<PropertyDetailModal slug={property.slug} onClose={() => {}} />);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText(property.name)).toBeInTheDocument();
    expect(screen.getByText(property.description)).toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<PropertyDetailModal slug={properties[0].slug} onClose={onClose} />);

    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalled();
  });

  it("closes when the backdrop is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { container } = render(<PropertyDetailModal slug={properties[0].slug} onClose={onClose} />);

    const backdrop = container.querySelector('[class*="backdrop"]');
    expect(backdrop).not.toBeNull();
    await user.click(backdrop as Element);

    expect(onClose).toHaveBeenCalled();
  });

  it("closes via the close button", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<PropertyDetailModal slug={properties[0].slug} onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "Close property details" }));

    expect(onClose).toHaveBeenCalled();
  });

  it("does not render any prev/next navigation controls", () => {
    render(<PropertyDetailModal slug={properties[1].slug} onClose={() => {}} />);

    expect(screen.queryByRole("button", { name: /^Previous property/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Next property/ })).not.toBeInTheDocument();
  });
});
