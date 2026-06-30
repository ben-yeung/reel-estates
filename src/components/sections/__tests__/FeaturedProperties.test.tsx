import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import FeaturedProperties from "../FeaturedProperties";
import { properties } from "@/lib/data-utils";

const { pushMock, replaceMock, searchParamsRef } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  replaceMock: vi.fn(),
  searchParamsRef: { current: new URLSearchParams() },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, replace: replaceMock, back: vi.fn() }),
  usePathname: () => "/",
  useSearchParams: () => searchParamsRef.current,
}));

describe("FeaturedProperties", () => {
  beforeEach(() => {
    pushMock.mockClear();
    replaceMock.mockClear();
    searchParamsRef.current = new URLSearchParams();
  });

  it("renders every property, featured ones first", () => {
    render(<FeaturedProperties />);

    const cards = screen.getAllByRole("button", { name: /\$/ });
    expect(cards).toHaveLength(properties.length);

    const featuredCount = properties.filter((p) => p.featured).length;
    cards.slice(0, featuredCount).forEach((card) => {
      expect(card).toHaveTextContent("Featured");
    });
    cards.slice(featuredCount).forEach((card) => {
      expect(card).not.toHaveTextContent("Featured");
    });
  });

  it("opens the detail modal and pushes the property into the URL when a card is clicked", async () => {
    const user = userEvent.setup();
    render(<FeaturedProperties />);

    await user.click(screen.getByRole("button", { name: new RegExp(properties[0].name) }));

    expect(pushMock).toHaveBeenCalledWith(`/?property=${properties[0].slug}`, { scroll: false });
  });

  it("renders the detail modal when the URL already has a property param", () => {
    searchParamsRef.current = new URLSearchParams(`property=${properties[0].slug}`);
    render(<FeaturedProperties />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
