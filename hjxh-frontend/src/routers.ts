import {
  API_GET_AD_FANGXIN,
  API_GET_AD_SCENE,
  API_GET_AD_SEARCH,
  API_GET_GOODS_COMMENTS,
  API_GET_GOODS_DETAIL,
  API_GET_GOODS_LIST,
  API_GET_ORDERS
} from "./const";

export interface RouterItemBase {
  key: string
  title: string
  icon?: string
  api?: string
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
        api: API_GET_ORDERS
      },
      {
        key: "goods",
        title: "商品系统",
        children: [
          {
            key: 'list',
            title: '商品列表',
            api: API_GET_GOODS_LIST
          },
          {
            key: 'detail',
            title: '商品明细',
            api: API_GET_GOODS_DETAIL
          },
          {
            key: 'comments',
            title: '商品评价',
            api: API_GET_GOODS_COMMENTS
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
            api: API_GET_AD_SEARCH
          },
          {
            key: "scene",
            title: "多多场景",
            api: API_GET_AD_SCENE
          },
          {
            key: "fangxin",
            title: "放心推",
            api: API_GET_AD_FANGXIN
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
        title: "账号管理",
      },
      // {
      //   key: "monitor",
      //   title: "数据监控"
      // }
    ],
  },
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
