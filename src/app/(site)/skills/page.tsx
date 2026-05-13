import { permanentRedirect } from "next/navigation";

/** Skills content lives on About (`#about-skills`). */
export default function SkillsRedirectPage() {
  permanentRedirect("/about");
}
