import React, { memo } from 'react';
import { Icon, Tooltip } from 'antd';
import {
  ChartCard,
  TagCloud,
  Field,


} from '@/components/Charts';


const tags = [];
for (let i = 0; i < 50; i += 1) {
  tags.push({
    name: `T${i}`,
    value: Math.floor((Math.random() * 50)) + 20,
  });
}


const tags2 = [
  {name: 'T1', value: 3000},
  {name: 'T2', value: 2700},
  {name: 'T3', value: 3200},
  {name: 'T4', value: 2900},
  {name: 'T5', value: 2000},
  {name: 'T6', value: 2900},
  {name: 'T7', value: 2200},
  {name: 'T8', value: 3200},
  {name: 'T9', value: 2900},
  {name: 'T10', value: 2000},
  {name: 'T11', value: 3000},
  {name: 'T12', value: 2700},
  {name: 'T13', value: 3200},
  {name: 'T14', value: 2900},
  {name: 'T15', value: 2000},
  {name: 'T16', value: 2900},
  {name: 'T17', value: 2200},
  {name: 'T18', value: 3200},
  {name: 'T19', value: 2900},
  {name: 'T20', value: 2000},
  {name: 'T11', value: 3000},
  {name: 'T12', value: 2700},
  {name: 'T13', value: 3200},
  {name: 'T14', value: 2900},
  {name: 'T15', value: 2000},
  {name: 'T16', value: 2900},
  {name: 'T17', value: 2200},
  {name: 'T18', value: 3200},
  {name: 'T19', value: 2900},
  {name: 'T20', value: 2000},
  {name: 'T10', value: 2000},
  {name: 'T11', value: 3000},
  {name: 'T12', value: 2700},
  {name: 'T13', value: 3200},
  {name: 'T14', value: 2900},
  {name: 'T15', value: 2000},
  {name: 'T16', value: 2900},
  {name: 'T17', value: 2200},
  {name: 'T18', value: 3200},
  {name: 'T19', value: 2900},
  {name: 'T20', value: 2000},
  {name: 'T11', value: 3000},
  {name: 'T12', value: 2700},
  {name: 'T13', value: 3200},
  {name: 'T14', value: 2900},
  {name: 'T15', value: 2000},
  {name: 'T16', value: 2900},
  {name: 'T17', value: 2200},
  {name: 'T18', value: 3200},
  {name: 'T19', value: 2900},
  {name: 'T20', value: 2000},
];


const ChartCard1 = memo(() => (

      <ChartCard
        title="雷达图"
        action={
          <Tooltip title="指标说明">
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total='12345678'
        footer={
          <Field
            label="底部可以有一些描述用语"
            value='12423'
          />
        }
      >
        <TagCloud data={tags2} height={200} />
      </ChartCard>

));


export default ChartCard1;

