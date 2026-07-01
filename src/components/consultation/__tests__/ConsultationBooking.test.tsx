import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ConsultationBooking from "@/components/sections/ConsultationBooking";
import { getAgentBySlug, properties } from "@/lib/data-utils";
import { LEAD_AGENT_SLUG } from "../booking";

const { searchParamsRef } = vi.hoisted(() => ({
  searchParamsRef: { current: new URLSearchParams() },
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => searchParamsRef.current,
}));

// A property whose agent is NOT the lead agent, so agent-fill changes are observable.
const nonLeadProperty = properties.find((p) => p.agentSlug !== LEAD_AGENT_SLUG)!;

describe("ConsultationBooking", () => {
  beforeEach(() => {
    searchParamsRef.current = new URLSearchParams();
  });

  it("defaults to a general enquiry routed to the lead agent", () => {
    render(<ConsultationBooking />);

    const leadAgent = getAgentBySlug(LEAD_AGENT_SLUG)!;
    expect(screen.getByText("Booking with")).toBeInTheDocument();
    expect(screen.getByText(leadAgent.name)).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /No specific property/ })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("auto-fills the property's agent when a property is selected", async () => {
    const user = userEvent.setup();
    render(<ConsultationBooking />);

    const agent = getAgentBySlug(nonLeadProperty.agentSlug)!;
    await user.click(screen.getByRole("option", { name: new RegExp(nonLeadProperty.name) }));

    expect(screen.getByText(agent.name)).toBeInTheDocument();
  });

  it("pre-selects the property and its agent from a ?book= deep link", () => {
    searchParamsRef.current = new URLSearchParams(`book=${nonLeadProperty.slug}`);
    render(<ConsultationBooking />);

    const agent = getAgentBySlug(nonLeadProperty.agentSlug)!;
    expect(screen.getByText(agent.name)).toBeInTheDocument();
    expect(screen.getByRole("option", { name: new RegExp(nonLeadProperty.name) })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("walks date -> time -> details and confirms inline", async () => {
    const user = userEvent.setup();
    render(<ConsultationBooking />);

    // Today is always selectable (past days are disabled).
    const today = new Date().getDate();
    await user.click(screen.getByRole("button", { name: String(today) }));

    await user.click(screen.getByRole("button", { name: "9:00 AM" }));

    await user.type(screen.getByPlaceholderText("Your name"), "Jordan Lee");

    const confirm = screen.getByRole("button", { name: /request consultation/i });
    // Disabled until a valid email is present.
    expect(confirm).toBeDisabled();

    await user.type(screen.getByPlaceholderText("you@example.com"), "jordan@example.com");
    expect(confirm).toBeEnabled();

    await user.click(confirm);

    expect(screen.getByText("Consultation requested")).toBeInTheDocument();
    expect(screen.getByText(/Jordan Lee/)).toBeInTheDocument();
    expect(screen.getByText(/9:00 AM/)).toBeInTheDocument();
  });
});
