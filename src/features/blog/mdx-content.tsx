
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";

import { MDXRemote } from "next-mdx-remote/rsc";

export async function MdxArticle({ source }: { source: string }) {
  return (
    <MDXRemote
      components={{
        hr: () => <hr className="my-8 border-white/10" />,
      }}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [rehypePrettyCode, { theme: "github-dark", keepBackground: false }],
          ],
        },
      }}
      source={source}
    />
  );
}
