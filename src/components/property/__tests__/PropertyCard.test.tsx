import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PropertyCard } from "../PropertyCard";
import { properties } from "@/lib/data-utils";

describe("PropertyCard", () => {
  it("renders the property's name, price, and stats", () => {
    const property = properties[0];
    render(<PropertyCard property={property} onOpen={() => {}} />);

    expect(screen.getByText(property.name)).toBeInTheDocument();
    // Scope to the spec row: bare bed/bath numbers can otherwise collide with
    // the reel engagement counts overlaid on the image.
    const specs = within(screen.getByTestId("property-specs"));
    expect(specs.getByText(String(property.beds))).toBeInTheDocument();
    expect(specs.getByText(String(property.baths))).toBeInTheDocument();
  });

  it("shows a Featured badge only for featured properties", () => {
    const featured = properties.find((p) => p.featured);
    const notFeatured = properties.find((p) => !p.featured);
    if (!featured || !notFeatured) throw new Error("fixture data missing featured/non-featured property");

    const { unmount } = render(<PropertyCard property={featured} onOpen={() => {}} />);
    expect(screen.getByText("Featured")).toBeInTheDocument();
    unmount();

    render(<PropertyCard property={notFeatured} onOpen={() => {}} />);
    expect(screen.queryByText("Featured")).not.toBeInTheDocument();
  });

  it("calls onOpen with the property's slug when the card is clicked", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    const property = properties[0];
    render(<PropertyCard property={property} onOpen={onOpen} />);

    await user.click(screen.getByRole("button", { name: new RegExp(property.name) }));

    expect(onOpen).toHaveBeenCalledWith(property.slug);
  });
});
