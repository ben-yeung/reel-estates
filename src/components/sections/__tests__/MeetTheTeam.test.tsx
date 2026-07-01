import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MeetTheTeam from "../MeetTheTeam";
import { agents, properties } from "@/lib/data-utils";

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
    // External social links only - the Consultation Booking CTA is internal.
    const links = within(card)
      .getAllByRole("link")
      .filter((link) => link.getAttribute("target") === "_blank");

    expect(links).toHaveLength(siriporn.socialLinks.length);
    links.forEach((link, i) => {
      expect(link).toHaveAttribute("href", siriporn.socialLinks[i].url);
      expect(link).toHaveAccessibleName(new RegExp(siriporn.name));
    });
  });

  it("gives each card a Book a consultation CTA deep-linking to one of the agent's properties", () => {
    render(<MeetTheTeam />);

    agents.forEach((agent) => {
      const card = screen.getByRole("heading", { level: 3, name: agent.name }).closest("article")!;
      const cta = within(card).getByRole("link", { name: /book a consultation/i });
      const slug = new URL(cta.getAttribute("href")!, "http://x").searchParams.get("book");
      expect(properties.find((p) => p.slug === slug)?.agentSlug).toBe(agent.slug);
    });
  });
});
