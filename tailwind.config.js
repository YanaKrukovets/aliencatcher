module.exports = {
  mode: "jit",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./locales/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      roboto: ["Roboto"],
      anek: ["Anek Latin"],
    },
    screens: {
      xxxl: { max: "2000px" },
      xxl: { max: "1920px" },
      xl: { max: "1536px" },
      xlg: { max: "1480px" },
      xxl: { max: "1340px" },
      xxlg: { max: "1300px" },
      lg: { max: "1200px" },
      xxmd: { max: "1130px" },
      mdlg: { max: "1024px" },
      xmd: { max: "999px" },
      md: { max: "768px" },
      sm: { max: "576px" },
      xsm: { max: "395px" },
      xs: { max: "360px" },
      xxs: { max: "340px" },
      xxxs: { max: "305px" },
    },
    colors: {
      green: "#2A5A51",
      gray: "#505758",
      textColor: "#25323c",
      lightGray: "#F2F2F2",
      yellow: "#FAED1A",
      middleGray: "#616060",
      black: "#2B2B2B",

      lightBlue: "#EEF7F8",
      white: "#FFFFFF",
      danger: "#ff3333",
    },
    extend: {
      maxWidth: {
        inner: "2000px",
        wrapper: "1238px",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@headlessui/tailwindcss")],
};
