import parseNumeric from "parse-numeric-range";
import path from "path";
import LRUCache from "lru-cache";
import type * as M from "mdast";
import type * as H from "hast";

const cache = new LRUCache<string, H.Element>({
  max: 1024 * 1024 * 32, // 32 mb
  length(value, key) {
    return JSON.stringify(value).length + (key ? key.length : 0);
  },
});

/*!
 * Adapted from
 * - ggoodman/nostalgie
 *   - MIT https://github.com/ggoodman/nostalgie/blob/45f3f6356684287a214dab667064ec9776def933/LICENSE
 *   - https://github.com/ggoodman/nostalgie/blob/45f3f6356684287a214dab667064ec9776def933/src/worker/mdxCompiler.ts
 */

const remarkSyntaxHightlight = () => {
  return async function transformer(tree: M.Root) {
    const shiki = await import("shiki");
    const { SKIP, visit } = await import("unist-util-visit");
    const { htmlEscape } = await import("escape-goat");

    const nightOwl = await shiki.loadTheme(
      path.resolve(__dirname, "../theme/theme.json")
    );
    const highlighter = await shiki.getHighlighter({
      themes: [nightOwl],
    });

    const theme = "Night Owl";

    visit(tree, "code", (node: M.Code) => {
      if (!node.lang || !node.value) return;

      const meta: string = Array.isArray(node.meta) ? node.meta[0] : node.meta;

      let params = new URLSearchParams();
      if (meta) {
        const hightlightLines = meta.match(/^\[(.*)\]/);
        if (hightlightLines) {
          params.set("lines", hightlightLines[1] ?? "");
        } else {
          params = new URLSearchParams(meta.split(/\s+/).join("&"));
        }
      }

      const hightlightLines = parseNumeric(params.get("lines") ?? "[]");

      const cacheKey = JSON.stringify([node.lang, node.value, hightlightLines]);
      let nodeValue = cache.get(cacheKey);

      if (!nodeValue) {
        const fgColor = highlighter.getForegroundColor(theme).toUpperCase();
        const bgColor = highlighter.getBackgroundColor(theme).toUpperCase();
        const tokens = highlighter.codeToThemedTokens(
          node.value,
          node.lang,
          theme
        );

        const children = tokens.map(
          (lineToke, zeroBasedLineNumber): H.Element => {
            const children = lineToke.map((token): H.Text | H.Element => {
              const color = token.color;
              const content: H.Text = {
                type: "text",
                value: token.content,
              };

              if (!color) return content;

              return color === fgColor
                ? content
                : {
                    type: "element",
                    tagName: "span",
                    properties: { style: `color: ${htmlEscape(color)}` },
                    children: [content],
                  };
            });

            children.push({ type: "text", value: "\n" });

            return {
              type: "element",
              tagName: "span",
              properties: {
                className: "codeblock-line",
                dataLineNumber: zeroBasedLineNumber + 1,
                dataHightlight: hightlightLines.includes(
                  zeroBasedLineNumber + 1
                ),
              },
              children,
            };
          }
        );

        nodeValue = {
          type: "element",
          tagName: "pre",
          properties: {
            dataLang: htmlEscape(node.lang),
            dataHightlight: hightlightLines.length > 0,
            style: `color: ${htmlEscape(
              fgColor
            )};background-color: ${htmlEscape(bgColor)}`,
          },
          children: [
            {
              type: "element",
              tagName: "code",
              children,
            },
          ],
        };

        cache.set(cacheKey, nodeValue);
      }

      const data = node.data ?? (node.data = {});

      // @ts-ignore
      node.type = "element";
      data.hProperties ??= {};
      data.hChildren = [nodeValue];

      return SKIP;
    });
  };
};

export { remarkSyntaxHightlight };
