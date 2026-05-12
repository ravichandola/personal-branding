import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { MdxArticle } from "@/features/blog/mdx-content";

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

  return (
    <article className="space-y-10">
      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-sky-300">
          Project narrative
        </p>
        <h1 className="text-4xl font-semibold">{project.title}</h1>
        <p className="text-lg text-slate-300">{project.excerpt}</p>
      </header>
      <MdxArticle source={project.markdown} />
    </article>
  );
}

export const dynamic = "force-dynamic";
