const path = require("path");
const defaultTheme = require("tailwindcss/defaultTheme");
const fromRoot = (p) => path.join(__dirname, p);

module.exports = {
  purge: {
    mode: "layers",
    content: [fromRoot("./app/**/*.+{html|js|ts|tsx|jsx|mdx|md}")],
  },
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Nunito", ...defaultTheme.fontFamily.sans],
      },
      margin: {
        "10vw": "10vw",
      },
      maxWidth: {
        main: "80rem",
      },
      typography: (theme) => {
        return {
          DEFAULT: {
            css: {
              "> *": {
                gridColumn: "1 / -1",

                [`@media (min-width: ${theme("screens.lg")})`]: {
                  gridColumn: "3 / span 8",
                },
              },
              pre: {
                overflow: "auto",
                position: "relative",
                padding: "2rem 0",
                marginTop: 0,
                borderRadius: 0,
                marginBottom: theme("spacing.6"),
                marginLeft: "-10vw",
                marginRight: "-10vw",

                [`@media (min-width: ${theme("screens.lg")})`]: {
                  borderRadius: "0.375rem",
                  gridColumn: "2 / span 10",
                  marginLeft: "0",
                  marginRight: "0",
                },
              },
              p: {
                marginTop: 0,
                marginBottom: theme("spacing.6"),
                fontSize: theme("fontSize.lg"),
              },
              a: {
                textDecoration: "none",
              },
              "a:hover, a:focus": {
                textDecoration: "underline",
                outline: "none",
              },
              "> div": {
                marginTop: 0,
                marginBottom: theme("spacing.6"),
              },
              "h1, h2, h3, h4, h5, h6": {
                marginTop: 0,
                marginBottom: 0,
              },
            },
          },
        };
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
