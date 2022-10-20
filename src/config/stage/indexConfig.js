const indexRouter = {
    name: null,
    route: null,
    filePath: null,
    title: '首页设置',
    type: 'folder',
    icon: 'iconfont icon-index',
    order: null,
    inNav: true,
    children: [
        {
            name: 'IndexList',
            route: '/index/list',
            filePath: 'view/index/indexConfig.vue',
            title: 'banner设置',
            type: 'view',
            icon: 'iconfont icon-index',
            order: null,
            inNav: true,
        },
    ],
}

export default indexRouter
