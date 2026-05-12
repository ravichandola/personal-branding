import { PageIntro } from "@/components/marketing/page-intro";
import { ContactForm } from "@/features/contact/contact-form";

export default function ContactPage() {
  return (
    <div className="space-y-12">
      <PageIntro
        eyebrow="Get in touch"
        title="Let’s talk about the problem you are trying to solve."
        description="Use the form for project inquiries, collaborations, or clear asks. I read everything that comes through and will reply by email. Social links stay in the site footer if you want to connect there too."
      />

      <ContactForm />
    </div>
  );
}
