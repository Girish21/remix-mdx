import { bundleMDX } from "mdx-bundler";
import fs from "fs";
import path from "path";

const getMDX = async (location: string) => {
  const file = fs.readFileSync(
    path.resolve(__dirname, `../pages/${location}.mdx`),
    { encoding: "utf-8" }
  );

  const code = await bundleMDX(file, {
    cwd: path.resolve(__dirname, "../pages"),
  });

  return code;
};

export { getMDX };
