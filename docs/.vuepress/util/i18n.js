var pinyin = require("pinyin");

const strArray = [...require("../settings/i18n.js")]
  .filter((i) => "default" in i)
  .sort((a, b) => b.default.length - a.default.length);

module.exports = function i18n(str, mode) {
  // from vuepress inject value
  const lang = this.$lang.replace(/[ \t]/g, "");

  for (langs of strArray) {
    if (langs.default === str) {
      if (typeof langs[lang] === "string") {
        str = langs[lang];
        break;
      }
    }
  }

  if (mode === "ascii-only" && !!lang.match("zh")) {
    str = pinyin(str, {
      style: pinyin.STYLE_NORMAL,
    })
      .map((s) => s.shift())
      .map((s) => {
        s = s.split("");
        s[0] = s[0].toUpperCase();
        return s.join("");
      })
      .join(" ");
  }

  return str;
};
