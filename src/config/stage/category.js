const categoryRouter = {
    name: null,
    route: null,
    filePath: null,
    title: '系列管理',
    type: 'folder',
    icon: 'iconfont icon-index',
    order: null,
    inNav: true,
    children: [
        {
            name: 'categoryList',
            route: '/category/categoryList',
            filePath: 'view/category/categoryList.vue',
            title: '系列列表',
            type: 'view',
            icon: 'iconfont icon-index',
            order: null,
            inNav: true,
        },
    ],
}

export default categoryRouter
