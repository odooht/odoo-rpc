import React, { memo } from 'react';
import { Icon, Tooltip } from 'antd';
import {
  ChartCard,
  Pie,
  Field,


} from '@/components/Charts';

const salesPieData = [
  {x:0, y: 10 },
  {x:1, y: 14 },
  {x:2, y: 12 },
  {x:3, y: 5 },
  {x:4, y: 19 },
  {x:5, y: 9 },
  {x:6, y: 17 },
]

const ChartCard1 = memo(() => (
      <ChartCard
        title="饼图"
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

        <Pie
          hasLegend
          title="销售额"
          subTitle="销售额"
          total='总数12333'
          data={salesPieData}
          valueFormat=''
          height={294}

        />
      </ChartCard>


));


export default ChartCard1;

