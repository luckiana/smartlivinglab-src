module.exports = {
  base: "/smartlivinglab/",
  title: "Smart Living Lab",
  description: "Smart Living Lab",
  dest: "build",
  head: [["link", { rel: "icon", href: "/assets/img/favicon.ico" }]],
  themeConfig: {
    logo: "/assets/img/tech.png",
    nav: [
      { text: "Home", link: "/" },
      { text: "VR Tour", link: "/vrtour/" },
    ],
  },
  locales: {
    // 键名是该语言所属的子路径
    // 作为特例，默认语言可以使用 '/' 作为其路径。
    '/': {
      lang: 'de-GE', // 将会被设置为 <html> 的 lang 属性
      title: 'Smart Living Lab',
      description: ''
    },
    '/zh/': {
      lang: 'zh-CN',
      title: '智能家居实验室',
      description: ''
    },
    '/en/': {
      lang: 'en-US',
      title: 'Smart Living Lab',
      description: ' '
    }
  }
};
