import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Hero from "./Hero";
import { getFeaturedProperties } from "@/lib/data-utils";

describe("Hero", () => {
  it("renders the brand title and the first featured property", () => {
    render(<Hero />);

    expect(screen.getByText("Reel")).toBeInTheDocument();
    expect(screen.getByText("Estates")).toBeInTheDocument();
    expect(
      screen.getByText("Southeast Asia's Premier Modern Homes")
    ).toBeInTheDocument();

    const featured = getFeaturedProperties()[0];
    expect(screen.getByText(featured.name)).toBeInTheDocument();
    expect(
      screen.getByText(
        `${featured.location.city}, ${featured.location.region}, ${featured.location.country}`
      )
    ).toBeInTheDocument();
  });
});
