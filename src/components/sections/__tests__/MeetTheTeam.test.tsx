import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MeetTheTeam from "../MeetTheTeam";
import { agents } from "@/lib/data-utils";

describe("MeetTheTeam", () => {
  it("renders a card for every agent, seniors first", () => {
    render(<MeetTheTeam />);

    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings.map((h) => h.textContent)).toEqual(agents.map((a) => a.name));
  });

  it("shows each agent's regions, reel/view stats, and quote", () => {
    render(<MeetTheTeam />);

    const made = agents.find((a) => a.slug === "made-wijaya")!;
    const card = screen.getByRole("heading", { level: 3, name: made.name }).closest("article")!;
    const scoped = within(card);

    made.regions.forEach((region) => {
      expect(scoped.getByText(region)).toBeInTheDocument();
    });
    expect(scoped.getByText(`${made.reelCount} reels`)).toBeInTheDocument();
    expect(scoped.getByText(/views$/)).toBeInTheDocument();
    // The quote is wrapped in typographic quotation marks via CSS, so match the
    // interior text only.
    expect(scoped.getByText(new RegExp(made.quote.slice(0, 20)))).toBeInTheDocument();
  });

  it("links each social platform out with an accessible label", () => {
    render(<MeetTheTeam />);

    const siriporn = agents.find((a) => a.slug === "siriporn-thanawan")!;
    const card = screen
      .getByRole("heading", { level: 3, name: siriporn.name })
      .closest("article")!;
    const links = within(card).getAllByRole("link");

    expect(links).toHaveLength(siriporn.socialLinks.length);
    links.forEach((link, i) => {
      expect(link).toHaveAttribute("href", siriporn.socialLinks[i].url);
      expect(link).toHaveAccessibleName(new RegExp(siriporn.name));
    });
  });

  it("renders no 'Book' contact CTA (deferred until the Consultation Booking exists)", () => {
    render(<MeetTheTeam />);
    expect(screen.queryByRole("button", { name: /book/i })).not.toBeInTheDocument();
  });
});
