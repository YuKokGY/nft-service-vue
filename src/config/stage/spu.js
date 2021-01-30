const spuRouter = {
  route: null,
  name: null,
  title: '商品管理',
  type: 'folder',
  icon: 'iconfont icon-shangpinguanli',
  filePath: 'view/spu/',
  order: null,
  inNav: true,
  children: [
    {
      title: '商品列表',
      type: 'view',
      name: 'SpuList',
      route: '/spu/list',
      filePath: 'view/spu/spuList.vue',
      inNav: true,
      icon: 'iconfont icon-shangpinguanli'
    },
    {
      title: '添加商品',
      type: 'view',
      name: 'SpuList',
      route: '/spu/create', // 路由显示路径
      filePath: 'view/spu/spu-create.vue', // 页面路径
      inNav: true, // 是否显示
      icon: 'iconfont icon-shangpinguanli', // 图标
      permission: ['添加商品'] // 权限限制
    }
  ]
}

export default spuRouter
