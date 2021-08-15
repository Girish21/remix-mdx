import * as React from "react";
import type { MetaFunction, LinksFunction, LoaderFunction } from "remix";
import { useRouteData } from "remix";
import { getMDX } from "../utils/getMDX.server";
import { getMDXComponent } from "mdx-bundler/client";

export let meta: MetaFunction = ({ data }) => {
  return {
    ...data.frontmatter,
  };
};

export let links: LinksFunction = () => {
  return [];
};

export let loader: LoaderFunction = async ({ request }) => {
  const data = await getMDX("index");
  return data;
};

export default function Index() {
  const data = useRouteData();

  const Component = React.useMemo(() => getMDXComponent(data.code), [data]);

  return (
    <main className="mx-10vw">
      <div className="prose max-w-main mx-auto grid grid-cols-4 gap-x-4 md:grid-cols-8 lg:grid-cols-12">
        <Component />
      </div>
    </main>
  );
}
