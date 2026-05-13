import { PageIntro } from "@/components/marketing/page-intro";
import { ContactForm } from "@/features/contact/contact-form";

const sectionPanel = "marketing-shell";

const sectionGlow = "marketing-glow-tr";

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="flex flex-col gap-14 lg:gap-[4.25rem]">
        <header className="scroll-mt-28">
          <PageIntro
            eyebrow="Get in touch"
            title="Let’s talk about the problem you are trying to solve."
            description="Use the form for project inquiries, collaborations, or clear asks. I read everything that comes through and will reply by email. Social links stay in the site footer if you want to connect there too."
          />
          <div className="page-rule" aria-hidden />
        </header>

        <section
          aria-labelledby="contact-form-heading"
          className="scroll-mt-28"
        >
          <div className={sectionPanel}>
            <div className={sectionGlow} aria-hidden />
            <div className="marketing-blur-bl" aria-hidden />

            <header className="relative z-[1] mb-8 space-y-4 sm:mb-10">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent sm:text-base">
                Write in
              </p>
              <h2
                id="contact-form-heading"
                className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              >
                Send a note
              </h2>
              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-[1.65]">
                No login required. Fields marked by validation hints below —
                keep it specific so replies stay useful.
              </p>
            </header>

            <ContactForm />
          </div>
        </section>
      </div>
    </div>
  );
}
