import React, { memo } from 'react';
import { Icon, Tooltip } from 'antd';
import {
  ChartCard,
  MiniProgress,
  Field,


} from '@/components/Charts';


const ChartCard1 = memo(() => (

      <ChartCard
        title="整个卡片的标题-柱状图例子"
        action={
          <Tooltip title="帮助性的文字, 指标说明">
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={() => '78%'}
        footer={
          <Field
            label="底部可以有一些描述用语"
            value='12423'
          />
        }
      >
        <MiniProgress percent={78} strokeWidth={8} target={80} />
      </ChartCard>

));


export default ChartCard1;

