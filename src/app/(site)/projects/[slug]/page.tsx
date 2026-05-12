import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";

import { GithubMark } from "@/components/icons/github-mark";
import { prisma } from "@/lib/prisma";
import { MdxArticle } from "@/features/blog/mdx-content";
import { githubPathLabel } from "@/lib/external-content";

export default async function ProjectDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const project = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project) {
    notFound();
  }

  const gh = project.githubUrl?.trim();
  const live = project.liveUrl?.trim();

  return (
    <article className="space-y-10">
      <header className="space-y-6">
        <p className="text-xs uppercase tracking-[0.3em] text-sky-300">
          Project
        </p>
        <h1 className="text-4xl font-semibold">{project.title}</h1>
        <p className="text-lg text-slate-300">
          {project.excerpt ?? project.description}
        </p>

        {(gh || live) && (
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {gh ? (
              <a
                href={gh}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 shadow transition hover:bg-slate-100"
              >
                <GithubMark className="size-5" />
                Open on GitHub
                <span className="ml-1 rounded-md bg-slate-200/80 px-2 py-0.5 text-xs font-medium text-slate-700">
                  {githubPathLabel(gh)}
                </span>
              </a>
            ) : null}
            {live ? (
              <a
                href={live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-emerald-300/50 hover:bg-white/5"
              >
                <ExternalLink className="size-4 opacity-80" aria-hidden />
                Live demo
              </a>
            ) : null}
          </div>
        )}

        {project.tech.length > 0 ? (
          <ul className="flex flex-wrap gap-2 pt-2">
            {project.tech.map((t) => (
              <li
                key={t}
                className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-slate-300"
              >
                {t}
              </li>
            ))}
          </ul>
        ) : null}
      </header>
      <MdxArticle source={project.markdown} />
    </article>
  );
}

export const dynamic = "force-dynamic";
