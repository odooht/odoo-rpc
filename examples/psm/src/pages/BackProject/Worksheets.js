import odoo from '@/odoo'

import React from 'react';
import Link from 'umi/link';
import { Table, Modal, Button, Form, Input, InputNumber,Select,DatePicker } from 'antd';
const FormItem = Form.Item;
const { Option } = Select;


class List extends React.Component {
  state = {
      visible: false,
      ids: [],
      recordsList: [],
      worksList: [],
  }

  columns = [
    {
      title: '',
      dataIndex: '_',
      render: (_, { id }) => {
        return (
          <Link to={`/BackProject/Worksheet?id=${id}`} >查看</Link>
        );
      },
    },

    {
      title: '状态',
      dataIndex: 'state',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '编码',
      dataIndex: 'code',
    },
    {
      title: '日期',
      dataIndex: 'date',
    },
    {
      title: '节点',
      dataIndex: 'work_id.name',
    },
    {
      title: '序号',
      dataIndex: 'number',
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
      title: '用户',
      dataIndex: 'user_id.name',
    },

  ]

  async componentDidMount() {
    if( ! odoo.user.uid ){
      return
    }

    const uid = odoo.user.uid


    const Model = await odoo.env('project.worksheet')
    const records = await Model.search([['work_id.user_id.id','=',uid]], {}, {order: 'code'})
    const data = records.look2()
    this.setState({ recordsList: data, ids: records.ids  })

    const Work = await odoo.env('project.work')
    const works = await Work.search([['user_id.id','=',uid]], {}, {order: 'name'})
    const worksList = works.look2()
    this.setState({ worksList  })

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

        const {
          name, code, work_id,
          date, number, qty,
        } = values

        const Model = await odoo.env('project.worksheet')

        const vals = {
          name, code, work_id,
          date:  date.year() + '-' + ( date.month() + 1) + '-' + date.date(),
          number, qty,
        }

        const new_rec = await Model.create(vals)

        if(new_rec){
          //TBD
          const { ids } = this.state;
          this.setState({
            ids: [...ids, new_rec.id]
          });

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
    const { visible, recordsList, worksList } = this.state;


    return (
      <div>
        <Table columns={this.columns} dataSource={recordsList} rowKey="id" />
        <Button onClick={this.showModal}>新建</Button>
        <Modal title="新建节点"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <FormItem label="名称">
              {getFieldDecorator('name', {
                rules: [{ required: true }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="编码">
              {getFieldDecorator('code', {
                rules: [{ required: true }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="日期">
              {getFieldDecorator('date', {
                rules: [{ required: true }],
              })(

                <DatePicker />
              )}
            </FormItem>

            <FormItem label="节点">
              {getFieldDecorator('work_id', {
                rules: [{ required: true }],
              })(
                <Select placeholder="请选择节点">
                  {
                    worksList.map(work => {
                      return (
                        <Option value={work.id} key="id">{work.full_name}</Option>
                      );
                    })
                  }
                </Select>
              )}
            </FormItem>

            <FormItem label="序号">
              {getFieldDecorator('number', {
                rules: [{ required: true }],
              })(
                <InputNumber />
              )}
            </FormItem>
            <FormItem label="数量">
              {getFieldDecorator('qty', {
                rules: [{ required: true }],
              })(
                <InputNumber />
              )}
            </FormItem>

          </Form>



        </Modal>
      </div>
    );
  }
}

export default Form.create()(List);

