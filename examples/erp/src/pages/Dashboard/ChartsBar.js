import React, { memo } from 'react';
import { Icon, Tooltip } from 'antd';
import {
  ChartCard,
  Bar,
  Field,
} from '@/components/Charts';

const salesData = [
  {x:'0', y: 123 },
  {x:'1', y: 421 },
  {x:'2', y: 144 },
  {x:'3', y: 423 },
  {x:'4', y: 123 },
  {x:'5', y: 533 },
  {x:'6', y: 122 },
]
const ChartCard1 = memo(() => (

      <ChartCard
        title="柱状图"
        action={
          <Tooltip title="帮助性的文字, 指标说明">
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={() => '126560'}
        footer={
          <Field
            label="底部可以有一些描述用语"
            value='12423'
          />
        }
      >
        <Bar title="图的标题-柱状图" height={295} data={salesData} />
      </ChartCard>

));


export default ChartCard1;

