import React from 'react';
import { Modal, Button, Form, Input,InputNumber,Select, Checkbox, DatePicker } from 'antd';
import FormItemLayout from '@/layouts/FormItemLayout';

import moment from 'moment';


const FormItem = Form.Item;
const { Option } = Select;

const getOptions = ({ item, record, ref_data={} })=> {
//  console.log('form get options', item)
  let value = null
  if(item.type ==='date'){
    const val = record[item.field] || null
    value = val && moment( val, 'YYYY-MM-DD')

  }
  else if(item.type ==='many2one'){
    const ref = ( ref_data && ref_data[item.relation] ) || []
    const ref_val = ref.length ? record[item.field] : {}
    value = ref_val && ref_val.id
  }
  else{
    value = record[item.field]
  }

  return {
    rules: item.rules || [],
    initialValue: value
  }
}

const getInput = ({ item, ref_data={} }) =>{
//  console.log('form get input', item, ref_data)
  if(item.type==='char'){
    return <Input />
  }
  else if (item.type==='date'){
    return  <DatePicker />
  }
  else if (item.type==='integer'){
    return <InputNumber />
  }
  else if (item.type==='boolean'){
    return <Checkbox />
  }
  else if (item.type==='selection'){
    return <Select>
        {
          item.selection.map( (option,index) => {
            return (<Option value={option[0]} key={index} >{option[1]}</Option> )
          } )
        }

      </Select>
  }
  else if (item.type==='many2one'){
    const ref = ( ref_data && ref_data[item.relation] ) || []
//    console.log(ref_data,ref)
    if( ref.length ){
      return (
        <Select>
          {
            ref.map( (option,index) => {
              return (<Option value={option.id} key={index} >{option.name}</Option> )
            } )
          }
        </Select> )
    }
    else{
      return <Input />
    }

  }
  else{
    return  <Input />
  }

}

class OdooForm extends React.Component {
  state = {
    visible: false,
    visibleDel: false,
  }
  async componentWillMount(){
    console.log('form will')

  }

  async componentDidMount(){
//    const {onMany2one, template} = this.props
//    const ref_data = await onMany2one(template)
    console.log('form did',
      //template, ref_data
    )
//    this.setState({ ref_data });
  }


  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false, });
  }


  handleOk = () => {
    const { onOk, form: { validateFields } } = this.props;

    validateFields( async  (err, values) => {

      if (!err) {
        onOk({type:'write', values} )
        // 重置 `visible` 属性为 false 以关闭对话框
        this.setState({ visible: false });
      }
    });
  }


  showModalDel = () => {
    console.log('delll12233')
    this.setState({ visibleDel: true });
  };

  handleCancelDel = () => {
    this.setState({ visibleDel: false, });
  }


  handleOkDel = () => {
    const { onOk } = this.props;
    onOk({type:'unlink'})
        // 重置 `visible` 属性为 false 以关闭对话框
    this.setState({ visibleDel: false });
    this.setState({ visible: false });

  }



  render() {
    const {
      visibleDelButton,
      buttom_name, title, record={}, ref_data, template,
      form: { getFieldDecorator } ,
    } = this.props

    const { visible,visibleDel  } = this.state

    return (
      <div>
        <Button onClick={this.showModal}>{buttom_name}</Button>
        <Modal title={title}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            {
              template.map( (item, index ) =>{
                return(
                  <FormItem {...FormItemLayout} label={item.label} key={index}>
                    {
                      getFieldDecorator(
                        item.field,
                        getOptions({item, record, ref_data })
                      ) ( getInput({ item, ref_data }) )
                    }
                  </FormItem>
                )
              })
            }
          </Form>

          {
            visibleDelButton !== undefined ? <Button onClick={this.showModalDel} >删除</Button> : null
          }

        </Modal>

        <Modal title='确认删除?'
            visible={visibleDel}
            onOk={this.handleOkDel}
            onCancel={this.handleCancelDel}
        >

            确认删除?
        </Modal>


      </div>
    );

  }

}

export default Form.create()(OdooForm);
