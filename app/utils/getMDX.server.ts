import { bundleMDX } from "mdx-bundler";
import fs from "fs";
import path from "path";
import type * as M from "mdast";
import type * as H from "hast";

import { remarkSyntaxHightlight } from "./remarkSyntaxHighlight.server";

// adapted from https://github.com/kentcdodds/remix-kentcdodds/blob/main/app/utils/compile-mdx.server.ts#L141
const rehypeReovePreContainingDiv = () => {
  return async (tree: M.Root) => {
    const { visit } = await import("unist-util-visit");

    visit(
      tree,
      { type: "element", tagName: "pre" },
      (node: H.Element, index, parent) => {
        if (parent?.type !== "element") return;
        const parentEl = parent as H.Element;
        if (parentEl.tagName !== "div") return;
        if (parentEl.children.length !== 1 && index === 0) return;
        Object.assign(parentEl, node);
      }
    );
  };
};

const getMDX = async (location: string) => {
  const file = fs.readFileSync(
    path.resolve(__dirname, `../pages/${location}.mdx`),
    { encoding: "utf-8" }
  );
  const { default: remarkAutoLinkHeading } = await import(
    "remark-autolink-headings"
  );
  const { default: remarkSlug } = await import("remark-slug");
  const { default: gfm } = await import("remark-gfm");

  const code = await bundleMDX(file, {
    cwd: path.resolve(__dirname, "../app/components"),
    xdmOptions(options) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        gfm,
        remarkSlug,
        [remarkAutoLinkHeading, { behavior: "wrap" }],
        remarkSyntaxHightlight,
      ];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeReovePreContainingDiv,
      ];

      return options;
    },
  });

  return code;
};

export { getMDX };
