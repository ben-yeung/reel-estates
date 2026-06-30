import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PropertyDetailModal } from "../PropertyDetailModal";
import { properties } from "@/lib/data-utils";

describe("PropertyDetailModal", () => {
  it("renders the open property's detail as an accessible dialog", () => {
    const property = properties[0];
    render(<PropertyDetailModal slug={property.slug} onClose={() => {}} onNavigate={() => {}} />);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText(property.name)).toBeInTheDocument();
    expect(screen.getByText(property.description)).toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<PropertyDetailModal slug={properties[0].slug} onClose={onClose} onNavigate={() => {}} />);

    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalled();
  });

  it("closes when the backdrop is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { container } = render(
      <PropertyDetailModal slug={properties[0].slug} onClose={onClose} onNavigate={() => {}} />
    );

    const backdrop = container.querySelector('[class*="backdrop"]');
    expect(backdrop).not.toBeNull();
    await user.click(backdrop as Element);

    expect(onClose).toHaveBeenCalled();
  });

  it("closes via the close button", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<PropertyDetailModal slug={properties[0].slug} onClose={onClose} onNavigate={() => {}} />);

    await user.click(screen.getByRole("button", { name: "Close property details" }));

    expect(onClose).toHaveBeenCalled();
  });

  it("steps to the adjacent property via prev/next", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<PropertyDetailModal slug={properties[1].slug} onClose={() => {}} onNavigate={onNavigate} />);

    await user.click(screen.getByRole("button", { name: new RegExp(`Next property: ${properties[2].name}`) }));
    expect(onNavigate).toHaveBeenCalledWith(properties[2].slug);

    await user.click(screen.getByRole("button", { name: new RegExp(`Previous property: ${properties[0].name}`) }));
    expect(onNavigate).toHaveBeenCalledWith(properties[0].slug);
  });

  it("does not render a previous control for the first property or a next control for the last", () => {
    const { rerender } = render(
      <PropertyDetailModal slug={properties[0].slug} onClose={() => {}} onNavigate={() => {}} />
    );
    expect(screen.queryByRole("button", { name: /^Previous property/ })).not.toBeInTheDocument();

    rerender(
      <PropertyDetailModal slug={properties[properties.length - 1].slug} onClose={() => {}} onNavigate={() => {}} />
    );
    expect(screen.queryByRole("button", { name: /^Next property/ })).not.toBeInTheDocument();
  });
});
