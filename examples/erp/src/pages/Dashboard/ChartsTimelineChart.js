import React, { memo } from 'react';
import { Icon, Tooltip } from 'antd';
import {
  ChartCard,

  TimelineChart,
  Field,


} from '@/components/Charts';


const chartData = [];
for (let i = 0; i < 20; i += 1) {
  chartData.push({
    x: (new Date().getTime()) + (1000 * 60 * 30 * i),
    y1: Math.floor(Math.random() * 100) + 1000,
    y2: Math.floor(Math.random() * 100) + 10,
  });
}

const ChartCard1 = memo(() => (

      <ChartCard
        title="时间线图"
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
  <TimelineChart
    height={200}
    data={chartData}
    titleMap={{ y1: '客流量', y2: '支付笔数' }}
  />
      </ChartCard>

));


export default ChartCard1;

