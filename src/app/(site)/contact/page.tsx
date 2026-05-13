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
            description="You’re hiring a person, not a ticket queue—use this form for project inquiries, collaborations, or a direct ask. I read every submission and answer from my own inbox. Prefer another channel? Social links live in the footer."
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
                Start the conversation
              </h2>
              <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-[1.65]">
                Share what you&apos;re building, where you&apos;re stuck, and what
                a good outcome looks like. No account or login—just the details I
                need to reply with something useful, straight to the email you
                leave below.
              </p>
            </header>

            <ContactForm />
          </div>
        </section>
      </div>
    </div>
  );
}
