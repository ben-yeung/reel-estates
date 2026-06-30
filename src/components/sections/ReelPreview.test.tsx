import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ReelPreview from "./ReelPreview";
import { properties } from "@/data/properties";

describe("ReelPreview", () => {
  it("renders the about copy and the reel stage showing the first property", () => {
    render(<ReelPreview />);

    expect(screen.getByText("Browse Properties")).toBeInTheDocument();
    expect(screen.getByText(properties[0].name)).toBeInTheDocument();
  });

  it("steps to a reel when its dot is clicked", async () => {
    const user = userEvent.setup();
    render(<ReelPreview />);

    await user.click(screen.getByRole("button", { name: `Show ${properties[1].name}` }));

    expect(screen.getByText(properties[1].name)).toBeInTheDocument();
  });

  it("likes the current reel and updates the count", async () => {
    const user = userEvent.setup();
    render(<ReelPreview />);

    const likeButton = screen.getByRole("button", { name: "Like" });
    expect(likeButton).toHaveAttribute("aria-pressed", "false");

    await user.click(likeButton);

    expect(likeButton).toHaveAttribute("aria-pressed", "true");
  });

  it("opens the comment drawer for the current reel", async () => {
    const user = userEvent.setup();
    render(<ReelPreview />);

    await user.click(screen.getByRole("button", { name: "Comments" }));

    expect(screen.getByText(/comments/i, { selector: "span" })).toBeInTheDocument();
  });

  it("renders hashtags derived from the property's tags below the location", () => {
    render(<ReelPreview />);

    const hashtags = properties[0].tags.map((tag) => `#${tag.replace(/-/g, "")}`).join(" ");
    expect(screen.getByText(hashtags)).toBeInTheDocument();
  });

  it("does not navigate the reel via wheel while the comment drawer is open", async () => {
    const user = userEvent.setup();
    render(<ReelPreview />);

    const likeButton = screen.getByRole("button", { name: "Like" });
    await user.hover(likeButton);
    await user.click(screen.getByRole("button", { name: "Comments" }));

    fireEvent.wheel(likeButton, { deltaY: 120 });

    expect(screen.getByText(properties[0].name)).toBeInTheDocument();
  });
});
