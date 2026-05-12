import { PageIntro } from "@/components/marketing/page-intro";
import { ContactForm } from "@/features/contact/contact-form";

export default function ContactPage() {
  return (
    <div className="space-y-12">
      <PageIntro
        eyebrow="Contact operations"
        title="Tell me about the reliability program, AI initiative, or QA reset you are planning."
        description="Submissions are persisted in Postgres, alerted through Resend/Nodemailer, and moderated with honeypot fields + per-address throttles."
      />
      <ContactForm />
    </div>
  );
}
