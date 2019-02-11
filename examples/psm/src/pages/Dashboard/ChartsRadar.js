import React, { memo } from 'react';
import { Icon, Tooltip } from 'antd';
import {
  ChartCard,
  Radar,
  Field,


} from '@/components/Charts';


const radarOriginData = [
  {
    name: '个人',
    ref: 10,
    koubei: 8,
    output: 4,
    contribute: 5,
    hot: 7,
  },
  {
    name: '团队',
    ref: 3,
    koubei: 9,
    output: 6,
    contribute: 3,
    hot: 1,
  },
  {
    name: '部门',
    ref: 4,
    koubei: 1,
    output: 6,
    contribute: 5,
    hot: 7,
  },
];
const radarData = [];
const radarTitleMap = {
  ref: '引用',
  koubei: '口碑',
  output: '产量',
  contribute: '贡献',
  hot: '热度',
};
radarOriginData.forEach((item) => {
  Object.keys(item).forEach((key) => {
    if (key !== 'name') {
      radarData.push({
        name: item.name,
        label: radarTitleMap[key],
        value: item[key],
      });
    }
  });
});


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
        <Radar
          hasLegend
          height={286}
          data={radarData}
        />
      </ChartCard>

));


export default ChartCard1;

