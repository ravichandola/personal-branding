import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AboutSkillsSection } from "@/features/about/about-skills-section";
import { ExperienceTimeline } from "@/features/experience/experience-timeline";

describe("Features suite · marketing page sections", () => {
  describe("experience/experience-timeline", () => {
    it("renders empty state as nothing", () => {
      const { container } = render(<ExperienceTimeline items={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it("renders role title and date range", () => {
      render(
        <ExperienceTimeline
          items={[
            {
              id: "1",
              company: "Acme",
              role: "Engineer",
              location: "Remote",
              startDate: new Date("2022-01-01"),
              endDate: null,
              summary: "Did things.",
              achievements: ["Shipped"],
              technologies: ["TS"],
            },
          ]}
        />,
      );

      expect(screen.getByText("Acme")).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Engineer" }),
      ).toBeInTheDocument();
      expect(screen.getByText("Did things.")).toBeInTheDocument();
      expect(screen.getByText("Shipped")).toBeInTheDocument();
      expect(screen.getByText("TS")).toBeInTheDocument();
      expect(screen.getByText("Current")).toBeInTheDocument();
    });
  });

  describe("about/about-skills-section", () => {
    it("shows empty guidance when no skills", () => {
      render(<AboutSkillsSection skills={[]} />);
      expect(
        screen.getByText(/No skills in the database yet/i),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: /Skills & depth/i }),
      ).toBeInTheDocument();
    });
  });
});
