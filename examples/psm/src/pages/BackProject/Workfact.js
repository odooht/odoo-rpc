import odoo from '@/odoo'

import React from 'react';

import { Card, Divider} from 'antd';

import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const { Description } = DescriptionList;

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

    return (
      <div>
      <PageHeaderWrapper title="详情">
        <Card bordered={false}>
          <DescriptionList size="large" title="节点信息" style={{ marginBottom: 32 }}>
            <Description term="节点名称">{(record.work_id || {}).name}</Description>
            <Description term="节点类型">{record.work_type}</Description>
            <Description term="单价">{record.price}</Description>
            <Description term="单位">{(record.uom_id || {}).name}</Description>
            <Description term="设计数量">{record.qty}</Description>
            <Description term="设计产值">{record.amount}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="进度报表" style={{ marginBottom: 32 }}>
            <Description term="日期">{record.date}</Description>
            <Description term="年">{record.year}</Description>
            <Description term="季">{record.quarter}</Description>
            <Description term="月">{record.month}</Description>
            <Description term="周">{record.week}</Description>
            <Description term="日">{record.day}</Description>
            <Description term="报表类型">{record.date_type}</Description>
            <Description term="期初产值">{record.amount_open}</Description>
            <Description term="本期产值">{record.amount_delta}</Description>
            <Description term="期末产值">{record.amount_close}</Description>
            <Description term="期初数量">{record.qty_open}</Description>
            <Description term="本期数量">{record.qty_delta}</Description>
            <Description term="期末数量">{record.qty_close}</Description>
            <Description term="期末完成率">{( record.rate || 0 ).toFixed(4) }</Description>

          </DescriptionList>
        </Card>

      </PageHeaderWrapper>
      </div>
    );
  }
}

export default List;

