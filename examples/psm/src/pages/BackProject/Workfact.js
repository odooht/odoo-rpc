import odoo from '@/odoo'

import React from 'react';

import { Card } from 'antd';


class List extends React.Component {
  state = {
      visiblePost: false,
      visible: false,
      record: {},
  }

  async componentDidMount() {
    const {location:{query:{id}}} = this.props
    const Model = await odoo.env('project.workfact')

    if (! id){
      return
    }

    const records = Model.view(Number(id))
    const record = records.look()
    this.setState({ record })
  }


  render() {
    const { record  } = this.state;
    const work_name = record.work_id ? record.work_id.name : ''
    const uom_name = record.uom_id ? record.uom_id.name : ''

    console.log(record)

    return (
      <div>
        <Card title="工单信息">
          <p>节点: {work_name}</p>
          <p>日期: {record.date}</p>
          <p>年: {record.year}</p>
          <p>季: {record.quarter}</p>
          <p>月: {record.month}</p>
          <p>周: {record.week}</p>
          <p>日: {record.day}</p>
          <p>类型: {record.date_type}</p>
          <p>设计产值: {record.amount}</p>
          <p>期初产值: {record.amount_open}</p>
          <p>本期产值: {record.amount_delta}</p>
          <p>期末产值: {record.amount_close}</p>
          <p>完成率: {( record.rate || 0 ).toFixed(4) }</p>
          <p>数量: {record.qty}</p>
          <p>单位: {uom_name}</p>
          <p>单价: {record.price}</p>
        </Card>


      </div>
    );
  }
}

export default List;

