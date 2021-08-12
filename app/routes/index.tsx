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

  return <Component />;
}
