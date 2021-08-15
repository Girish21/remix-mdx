import { bundleMDX } from "mdx-bundler";
import fs from "fs";
import path from "path";
import { remarkSyntaxHightlight } from "./remarkSyntaxHighlight.server";

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

      return options;
    },
  });

  return code;
};

export { getMDX };
