import {Table, TableColumnProps} from "antd";

const columns: TableColumnProps<any>[] = [
  {
    dataIndex: "spec",
    title: 'SKU名称'
  },
  {
    dataIndex: "skuId",
    title: 'SKU ID'
  },
  {
    dataIndex: 'skuQuantity',
    title: '数量'
  },
  {
    dataIndex: 'normalPrice',
    title: '标准价格'
  },
  {
    dataIndex: 'groupPrice',
    title: '组团价格'
  }
]


export const CompRawSkuList = (props: {data: any[]}) => {
  return (
    <Table dataSource={props.data} rowKey={'skuId'} columns={columns} pagination={false} style={{background: '#eee'}}/>
  )
}