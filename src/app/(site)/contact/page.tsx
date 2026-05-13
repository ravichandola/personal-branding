import { PageIntro } from "@/components/marketing/page-intro";
import { ContactForm } from "@/features/contact/contact-form";

const sectionPanel =
  "relative overflow-hidden rounded-[1.75rem] border border-zinc-200/90 bg-gradient-to-b from-zinc-50/95 via-white/92 to-zinc-100/80 p-8 shadow-sm ring-1 ring-black/[0.03] dark:border-zinc-800/90 dark:from-zinc-950/95 dark:via-zinc-950/75 dark:to-black/50 dark:ring-white/[0.04] sm:p-10 lg:p-12";

const sectionGlow =
  "pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-orange-400/18 blur-3xl dark:bg-orange-500/22";

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
          <div
            className="mx-auto mt-12 h-px max-w-xs bg-gradient-to-r from-transparent via-orange-500/40 to-transparent dark:via-orange-400/35 lg:mt-16"
            aria-hidden
          />
        </header>

        <section
          aria-labelledby="contact-form-heading"
          className="scroll-mt-28"
        >
          <div className={sectionPanel}>
            <div className={sectionGlow} aria-hidden />
            <div
              className="pointer-events-none absolute -bottom-32 left-1/4 h-48 w-48 rounded-full bg-orange-600/10 blur-3xl dark:bg-orange-600/15"
              aria-hidden
            />

            <header className="relative z-[1] mb-8 space-y-4 sm:mb-10">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700 dark:text-orange-400 sm:text-base">
                Write in
              </p>
              <h2
                id="contact-form-heading"
                className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-3xl"
              >
                Send a note
              </h2>
              <p className="max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg sm:leading-[1.65]">
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
