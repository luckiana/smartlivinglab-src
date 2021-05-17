const vrtour = require('./vrtour')

module.exports = {
    vrtour,
    dest: 'build',
    site: {
        base: '/smart-living-lab/'
    },
    themeConfig: {
        displayAllHeaders: true,
        sidebar: [
            '/vrtour',
            '/network',
            '/devices'
        ],
        locales: {
            '/': {
                selectText: 'Sprach',
                label: 'Deutsch',
                ariaLabel: "Sprachen",
                editLinkText: "Editiere diese Seite auf GitHub",
                nav: [
                    { text: 'Home', link: '/' },
                    { text: 'VR Tour', link: '/vrtour/' }
                ],
                sidebar: [
                    '/vrtour',
                    '/network',
                    '/devices'
                ],
            },
            '/zh-Hans/': {
                selectText: '语言',
                label: '简体中文',
                ariaLabel: "语言",
                editLinkText: "在 GitHub 上编辑",
                nav: [
                    { text: '主页', link: '/zh-Hans/' },
                    { text: 'VR旅行', link: '/zh-Hans/vrtour/' }
                ],
                sidebar: [
                    '/zh-Hans/vrtour',
                    '/zh-Hans/network',
                    '/zh-Hans/devices'
                ],
            },
            '/en/': {
                selectText: 'Language',
                label: 'English',
                ariaLabel: "Languages",
                editLinkText: "Edit this page on GitHub",
                nav: [
                    { text: 'Home', link: '/en/' },
                    { text: 'VR Tour', link: '/en/vrtour/' }
                ],
                sidebar: [
                    '/en/vrtour',
                    '/en/network',
                    '/en/devices'
                ],
            }
        }
    },
    locales: {
        '/': {
            lang: 'de',
            title: "Smart Living Labor",
            description: "Labor für Smart Homes und Assistive Technologien",
        },
        '/zh-Hans/': {
            lang: '	zh-Hans',
            title: '智能家居实验室',
            description: "为智能家居与辅助技术实验室",
        },
        '/en/': {
            lang: 'en',
            title: 'Smart Living Lab',
            description: "Lab for Smart Homes and Assistive Technologies",
        }
    },
}