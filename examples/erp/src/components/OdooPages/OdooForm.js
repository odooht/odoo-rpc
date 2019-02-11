import React from 'react';
import { Form, Input,InputNumber,Select, Checkbox, DatePicker } from 'antd';
import FormItemLayout from '@/layouts/FormItemLayout';

import moment from 'moment';


const FormItem = Form.Item;
const { Option } = Select;

const getOptions = ({ item, record, ref_data={} })=> {
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
    ref_data: null
  }
  async componentDidMount(){
    this.props.onRef(this)

    const {onMany2one, template} = this.props

    const ref_data = await onMany2one(template)

    this.setState({ ref_data });
    console.log(ref_data)

  }

  render() {
    const { record={}, template, form: { getFieldDecorator } } = this.props
    const { ref_data } = this.state

    return (
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
    );

  }

}

export default Form.create()(OdooForm);
