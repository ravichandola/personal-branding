import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { JsonLd } from "@/components/seo/json-ld";
import { PageIntro } from "@/components/marketing/page-intro";

describe("Components suite · marketing shell", () => {
  describe("seo/json-ld", () => {
    it("serializes JSON-LD payload into a script tag", () => {
      const data = {
        "@context": "https://schema.org",
        "@type": "Thing",
        name: "x",
      };
      const { container } = render(<JsonLd data={data} />);
      const script = container.querySelector(
        'script[type="application/ld+json"]',
      );
      expect(script?.textContent).toContain('"name":"x"');
    });
  });

  describe("marketing/page-intro", () => {
    it("renders eyebrow, title, and optional description", () => {
      render(
        <PageIntro
          eyebrow="Section"
          title="Big headline"
          description="Supporting copy."
        />,
      );
      expect(screen.getByText("Section")).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Big headline",
      );
      expect(screen.getByText("Supporting copy.")).toBeInTheDocument();
    });
  });
});
