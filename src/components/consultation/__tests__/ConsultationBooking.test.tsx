import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ConsultationBooking from "@/components/sections/ConsultationBooking";
import { getAgentBySlug, properties } from "@/lib/data-utils";
import { CONFIRMATION_RESET_MS, LEAD_AGENT_SLUG } from "../booking";

const { searchParamsRef } = vi.hoisted(() => ({
  searchParamsRef: { current: new URLSearchParams() },
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => searchParamsRef.current,
}));

// A property whose agent is NOT the lead agent, so agent-fill changes are observable.
const nonLeadProperty = properties.find((p) => p.agentSlug !== LEAD_AGENT_SLUG)!;

// The "Booking with [agent]" chip only appears once a date is chosen, so agent
// assertions pick today (always selectable) to advance into the details step.
async function pickToday(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: String(new Date().getDate()) }));
}

describe("ConsultationBooking", () => {
  beforeEach(() => {
    searchParamsRef.current = new URLSearchParams();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("defaults to a general enquiry and routes to the lead agent after a date is chosen", async () => {
    const user = userEvent.setup();
    render(<ConsultationBooking />);

    expect(screen.getByRole("option", { name: /No specific property/ })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    // Agent is not shown while still on the calendar step.
    expect(screen.queryByText("Booking with")).not.toBeInTheDocument();

    await pickToday(user);

    const leadAgent = getAgentBySlug(LEAD_AGENT_SLUG)!;
    expect(screen.getByText("Booking with")).toBeInTheDocument();
    expect(screen.getByText(leadAgent.name)).toBeInTheDocument();
  });

  it("auto-fills the property's agent when a property is selected", async () => {
    const user = userEvent.setup();
    render(<ConsultationBooking />);

    await user.click(screen.getByRole("option", { name: new RegExp(nonLeadProperty.name) }));
    await pickToday(user);

    const agent = getAgentBySlug(nonLeadProperty.agentSlug)!;
    expect(screen.getByText(agent.name)).toBeInTheDocument();
  });

  it("pre-selects the property and its agent from a ?book= deep link", async () => {
    const user = userEvent.setup();
    searchParamsRef.current = new URLSearchParams(`book=${nonLeadProperty.slug}`);
    render(<ConsultationBooking />);

    expect(screen.getByRole("option", { name: new RegExp(nonLeadProperty.name) })).toHaveAttribute(
      "aria-selected",
      "true"
    );

    await pickToday(user);
    const agent = getAgentBySlug(nonLeadProperty.agentSlug)!;
    expect(screen.getByText(agent.name)).toBeInTheDocument();
  });

  it("transforms to the details step on date pick and can go back to the calendar", async () => {
    const user = userEvent.setup();
    render(<ConsultationBooking />);

    await pickToday(user);
    // Details step: agent chip, time slots, and name/email are all present.
    expect(screen.getByText("Booking with")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "9:00 AM" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your name")).toBeInTheDocument();

    // The back control returns to the calendar and hides the agent chip again.
    await user.click(screen.getByRole("button", { name: /change date/i }));
    expect(screen.queryByText("Booking with")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "9:00 AM" })).not.toBeInTheDocument();
  });

  it("walks date -> time -> details and confirms inline", async () => {
    const user = userEvent.setup();
    render(<ConsultationBooking />);

    await pickToday(user);
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
    expect(screen.getByText(/will be in touch soon/i)).toBeInTheDocument();
  });

  it("resets to a fresh calendar after the confirmation times out", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date(2026, 5, 30));
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<ConsultationBooking />);

    await user.click(screen.getByRole("button", { name: "30" }));
    await user.click(screen.getByRole("button", { name: "9:00 AM" }));
    await user.type(screen.getByPlaceholderText("Your name"), "Jordan Lee");
    await user.type(screen.getByPlaceholderText("you@example.com"), "jordan@example.com");
    await user.click(screen.getByRole("button", { name: /request consultation/i }));

    expect(screen.getByText("Consultation requested")).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(CONFIRMATION_RESET_MS);
    });

    // Back on a fresh calendar: success gone, day selectable, chip hidden.
    expect(screen.queryByText("Consultation requested")).not.toBeInTheDocument();
    expect(screen.queryByText("Booking with")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "30" })).toBeInTheDocument();
  });
});
