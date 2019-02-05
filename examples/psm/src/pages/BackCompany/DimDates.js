import odoo from '@/odoo'

import React from 'react';
import Link from 'umi/link';
import { Table, Modal, Button, Form, DatePicker } from 'antd';
import FormItemLayout from '@/layouts/FormItemLayout';

const FormItem = Form.Item;



const getDimDate = (td)=>{
/*
        console.log(date)
        console.log('year=', date.year() )
        console.log('weeksInYear=', date.weeksInYear() )
        console.log('weeks=', date.weeks() )
        console.log('weekday=', date.weekday() )
        console.log('weekYear=', date.weekYear() )
        console.log('week=', date.week() )
        console.log('quarter=', date.quarter() )
        console.log('quarters=', date.quarters() )
        console.log('month=', date.month() )
        console.log('daysInMonth=', date.daysInMonth() )
        console.log('days=', date.days() )
        console.log('dayOfYear=', date.daysInMonth() )
        console.log('day=', date.day() )
        console.log('dates=', date.dates() )
        console.log('date=', date.date() )
*/

    const year = td.year()
    const month= td.month()+1
    const day =  td.date()
    const week=  td.week() - 1
    const quarter = td.quarter()

    return {
        date: year + '-' + month + '-' + day,
        year,
        quarter,
        month,
        day,
        week,
        quarterkey: year*100 + quarter,
        monthkey:   year*100 + month,
        daykey:     year*10000 + month*100 + day,
        weekkey:    year*100 + week,
    }

}

class List extends React.Component {
  state = {
      visible: false,
      ids: [],
      recordsList: [],
  }

  columns = [
    {
      title: '',
      dataIndex: '_',
      render: (_, { id }) => {
        return (
          <Link to={`/BackCompany/DimDate?id=${id}`} >查看</Link>
        );
      },
    },

    {
      title: '日历日期',
      dataIndex: 'date',
    },

    {
      title: 'YYYYMMDD',
      dataIndex: 'daykey',
    },
    {
      title: 'YYYYww',
      dataIndex: 'weekkey',
    },
    {
      title: 'YYYYMM',
      dataIndex: 'monthkey',
    },

    {
      title: 'YYYY0Q',
      dataIndex: 'quarterkey',
    },

    {
      title: 'year',
      dataIndex: 'year',
    },

/*
    {
      title: 'Day',
      dataIndex: 'day',
    },
    {
      title: 'week',
      dataIndex: 'week',
    },
    {
      title: 'month',
      dataIndex: 'month',
    },

    {
      title: 'quarter',
      dataIndex: 'quarter',
    },

*/


  ]

  async componentDidMount() {
    const Model = await odoo.env('olap.dim.date')
    const records = await Model.search([], {}, {order: 'date'})
    const data = records.look2()
    this.setState({ recordsList: data, ids: records.ids  })

  }

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  handleOk = () => {
    const { form: { validateFields } } = this.props;

    validateFields( async  (err, values) => {
 //     if (!err) {
        const {date} = values
        const vals = getDimDate(date)

     //   console.log(vals)
        console.log( vals )

        const Model = await odoo.env('olap.dim.date')

        const search_rec = await Model.search([['date','=',vals.date]])
        if(search_rec.length===0){
          const new_rec = await Model.create(vals)
          if(new_rec){
            //TBD
            const { ids } = this.state;
            this.setState({
              ids: [...ids, new_rec.id]
            });
          }
        }



        const { ids } = this.state;

        const records = Model.view(ids)
        const data = records.look2()
        this.setState({ recordsList: data  })

        this.setState({ recordsList: data, ids: records.ids  })

        // 重置 `visible` 属性为 false 以关闭对话框
        this.setState({ visible: false });
 //     }
    });
  }

  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { visible,recordsList } = this.state;

    return (
      <div>
        <Table columns={this.columns} dataSource={recordsList} rowKey="id" />
        <Button onClick={this.showModal}>新建</Button>
        <Modal title="新建"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <FormItem {...FormItemLayout} label="日期">
              {getFieldDecorator('date', {
                rules: [{ required: true }],
              })(

                <DatePicker />
              )}
            </FormItem>
            <div>时间维度的其他字段是计算而得, 目前支持日历约定的年季月周日规定</div>
            <div>自定义报表的年季月周日的时间段, 需要在公司层面设置参数, 根据参数计算而得</div>

          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(List);

