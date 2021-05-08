// .vuepress/config.js
const settings = require('./settings')
const containerPlugins = require('./plugins/container')

const dest = settings.dest
const base = process.env.BASE ||
    settings.site.base || void 0
const themeConfig = settings.themeConfig
const locales = settings.locales

module.exports = {
    base,
    dest,
    themeConfig,
    locales,
    head: [
        ["link", { rel: "icon", href: "/favicon.ico" }]
    ],
    markdown: {
        extendMarkdown: (md) => {
            md.use(require("markdown-it-sub"));
            md.use(require("markdown-it-sup"));
            md.use(require("markdown-it-video"));
        },
    },
    plugins: [
        ...containerPlugins
    ]
}