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
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
