import odoo from '@/odoo'

import React from 'react';
import Link from 'umi/link';
import { Table  } from 'antd';


class List extends React.Component {
  state = {
      ids: [],
      recordsList: [],
  }

  columns = [
    {
      title: '',
      dataIndex: '_',
      render: (_, { id }) => {
        return (
          <Link to={`/BackProject/Workfact?id=${id}`} >查看</Link>
        );
      },
    },
    {
      title: '节点',
      dataIndex: 'work_id.name',
    },
    {
      title: '日期',
      dataIndex: 'date',
    },
    {
      title: '类型',
      dataIndex: 'date_type',
    },

    {
      title: '设计产值',
      dataIndex: 'amount',
    },
    {
      title: '期初产值',
      dataIndex: 'amount_open',
    },
    {
      title: '本期产值',
      dataIndex: 'amount_delta',
    },
    {
      title: '期末产值',
      dataIndex: 'amount_close',
    },
    {
      title: '完成率',
      dataIndex: 'rate',
    },

    {
      title: '数量',
      dataIndex: 'qty',
    },

    {
      title: '单位',
      dataIndex: 'uom_id.name',
    },
    {
      title: '单价',
      dataIndex: 'price',
    },
  ]

  async componentDidMount() {
    const Model = await odoo.env('project.workfact')
    const records = await Model.search([] //, {}, {order: 'date_type date_id work_id'}
    )
    const data = records.look2()

    this.setState({ recordsList: data, ids: records.ids  })
  }

  render() {
    const {  recordsList } = this.state;

    const records = recordsList.reduce((acc,cur)=>{
      cur.rate = cur.rate.toFixed(4)
      acc.push(cur)
      return acc
    },[])


    return (
      <div>
        <Table columns={this.columns} dataSource={records} rowKey="id" />
      </div>
    );
  }
}

export default  List;

