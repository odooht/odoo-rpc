import React, { memo } from 'react';
import {Icon, Tooltip } from 'antd';
import {
  ChartCard,
  Gauge,
  Field,

} from '@/components/Charts';


const ChartCard1 = memo(() => (
      <ChartCard
        title="仪表盘"
        action={
          <Tooltip title="指标说明">
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        footer={
          <Field
            label="底部可以有一些描述用语"
            value='12423'
          />
        }
      >
        <Gauge title="某某指标" height={164} percent={87} />
      </ChartCard>

));


export default ChartCard1;

