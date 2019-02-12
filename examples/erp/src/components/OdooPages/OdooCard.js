import React from 'react';
import { Card, Divider  } from 'antd';

import Link from 'umi/link';


import DescriptionList from '@/components/DescriptionList';
const { Description } = DescriptionList;

const getValue =({col, record})=>{
    const fs = col.dataIndex.split('.')
    const fld = fs[0]
    if( fs.length > 1 ){
      const ref_fld = fs[1]
      return (record[fld] || {})[ref_fld]
    }
    else{
      return record[fld]
    }
}




const OdooDescriptionList = ({model, item, record}) => {
  return (
    <DescriptionList size="large" title={item.title} style={{ marginBottom: 32 }}>
      {
        item.columns.map((col, index ) => {
          if ( col.type === 'many2many' || col.type === 'one2many' ){
            const id = record.id
            const child_ids = record[col.dataIndex]
            const child_len = (child_ids || [] ).length
//            console.log(model,id, col,item, record)

            const listPath = '/Default/M2mListPage'

            return(
              <Description term={col.title} key={index} >
                <div>共{child_len}条</div>
                <Link to={`${listPath}?model=${model}&id=${id}&field=${col.dataIndex}`} >查看</Link>
              </Description>
            )
          }
          else{
            return(
              <Description term={col.title} key={index} >
                { getValue({col, record})
                }
              </Description>
            )
          }
        })
      }
    </DescriptionList>
  )
}

const OdooCard = ( { model, record, template }) => {
  return (
    <div >
        <Card bordered={false}>
          {
            template.map( (item,index) =>{
              if(item.title){
                return(
                  <OdooDescriptionList
                    model={model}
                    record={record}
                    item={item}
                    key={index}
                  />
                )
              }
              else{
                return (<Divider style={{ marginBottom: 32 }} key={index}/>)
              }

            })
          }
        </Card>
    </div>

  );
};


export default OdooCard;
