module.exports = {
  plugins: [
    [
      "@vuepress/search",
      {
        searchMaxSuggestions: 10,
      },
    ],
  ],
  extend: "@vuepress/theme-default",
};
