export interface RouterItemBase {
  key: string
  title: string
  icon?: string
  collName?: string
  children?: RouterItemBase[]
}

export interface RouterItemWithPath extends RouterItemBase {
  path: string
  children?: RouterItemWithPath[]
}

export const routerOfRawData: RouterItemBase =  {
    key: "rawdata",
    title: "原始数据",
    icon: "icon-jurassic_data",
    children: [
      {
        key: "orders",
        title: "订单列表",
        collName: "V2_orders"
      },
      {
        key: "goods",
        title: "商品系统",
        children: [
          {
            key: 'list',
            title: '商品列表',
            collName: "V2_goods_list"
          },
          {
            key: 'detail',
            title: '商品明细',
            collName: "V2_goods_detail"
          },
          {
            key: 'comments',
            title: '商品评价',
            collName: "V2_goods_comments"
          }
        ]
      },
      {
        key: 'ad',
        title: '推广系统',
        children: [
          {
            key: "search",
            title: "多多推广",
            collName: "V2_ad_search"
          },
          {
            key: "scene",
            title: "多多场景",
            collName: "V2_ad_scene"
          },
          {
            key: "fangxin",
            title: "放心推",
            collName: "V2_ad_fangxin"
          },
        ]
      },
    ],
  }

export const routersBase: RouterItemBase[] = [
  {
    key: "home",
    title: "首页",
    icon: "icon-shouye",
  },
  {
    key: "analysis",
    title: "单品聚合",
    icon: "icon-zhujijuhe",
    children: [
      {
        key: "orders",
        title: "SKU分析",
      },
      {
        key: "ad",
        title: "推广分析",
      },
    ],
  },

  routerOfRawData,

  {
    key: "users",
    title: "店铺相关",
    icon: "icon-pingtaiyilan",
    children: [
      {
        key: "login",
        title: "运营列表",
      },
      // {
      //   key: "monitor",
      //   title: "数据监控"
      // }
    ],
  },

  {
    key:'accounts',
    title: '账号相关'
  }
]

const addRouterItemWithPath = (
  router: RouterItemBase,
  keyBase: string = ""
): RouterItemWithPath => {
  let path = [keyBase, router.key].join("/")
  let routerWithPath: RouterItemWithPath = { ...router, path, children: undefined }
  if (router.children) {
    routerWithPath.children = router.children.map((subRouter) =>
      addRouterItemWithPath(subRouter, path)
    )
  }
  return routerWithPath
}

export const routerWithPath = routersBase.map((i) => addRouterItemWithPath(i))

export default routerWithPath

if (require.main === module) {
  console.log(routerWithPath)
}
