import React, { memo } from 'react';
import { Icon, Tooltip } from 'antd';
import {
  ChartCard,

  WaterWave,
  Field,


} from '@/components/Charts';


const ChartCard1 = memo(() => (

      <ChartCard
        title="水波图"
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
        <div style={{ textAlign: 'center' }}>
          <WaterWave
            height={161}
            title="指标名称"
            percent={34}
          />
        </div>

      </ChartCard>

));


export default ChartCard1;

