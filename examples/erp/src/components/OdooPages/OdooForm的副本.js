import React from 'react';
import { Form, Input } from 'antd';
import FormItemLayout from '@/layouts/FormItemLayout';

const FormItem = Form.Item;


const OdooForm = ( { record={}, template, form }) => {
  const { getFieldDecorator } = form;
  return (
    <Form>
      {
        template.map( (item, index ) =>{
          return(
            <FormItem {...FormItemLayout} label={item.label} key={index}>
              {getFieldDecorator(item.field, {
                rules: item.rules || [],
                initialValue: record[item.field]
              })(
                <Input />
              )}
            </FormItem>
          )
        })
      }
    </Form>
  );
};


export default OdooForm;
