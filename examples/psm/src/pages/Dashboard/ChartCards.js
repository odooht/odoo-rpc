import React, { memo } from 'react';
import { Row, Col, Icon, Tooltip } from 'antd';
import { yuan, ChartCard, MiniArea, MiniBar, MiniProgress, Field } from '@/components/Charts';

import Trend from '@/components/Trend';
import numeral from 'numeral';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};



const visitData = [
  {x:0, y: 24 },
  {x:1, y: 92 },
  {x:2, y: 33 },
  {x:3, y: 63 },
  {x:4, y: 11 },
  {x:5, y: 32 },
  {x:6, y: 66 },
]

const loading = false

const ChartCard1 = memo(() => (
  <Row gutter={24}>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title="某某指标"
        action={
          <Tooltip
            title="指标说明"
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        loading={loading}
        total={() => yuan(126560)}
        footer={
          <Field
            label="底部信息"
            value={`￥${numeral(12423).format('0,0')}`}
          />
        }
        contentHeight={46}
      >
        <Trend flag="up" style={{ marginRight: 16 }}>
          <span>周增长</span>
          <span style={{ marginLeft: 8 }}>12%</span>
        </Trend>
        <Trend flag="down">
          <span>日增长</span>
          <span style={{ marginLeft: 8 }}>11%</span>
        </Trend>
      </ChartCard>

    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title="Visits"
        action={
          <Tooltip
            title="Introduce"
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={numeral(8846).format('0,0')}
        footer={
          <Field
            label="Daily Visits"
            value={numeral(1234).format('0,0')}
          />
        }
        contentHeight={46}
      >
        <MiniArea color="#975FE4" data={visitData} />
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title="Payments"
        action={
          <Tooltip
            title="Introduce"
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={numeral(6560).format('0,0')}
        footer={
          <Field
            label="Conversion Rate"
            value="60%"
          />
        }
        contentHeight={46}
      >
        <MiniBar data={visitData} />
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        loading={loading}
        bordered={false}
        title="Operational Effect"
        action={
          <Tooltip
            title="Introduce"
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total="78%"
        footer={
          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
            <Trend flag="up" style={{ marginRight: 16 }}>
              <span>"周同比"</span>
              <span style={{ marginLeft: 8 }}>12%</span>
            </Trend>
            <Trend flag="down">
              <span>"日同比"</span>
              <span style={{ marginLeft: 8 }}>11%</span>
            </Trend>
          </div>
        }
        contentHeight={46}
      >
        <MiniProgress percent={78} strokeWidth={8} target={80} color="#13C2C2" />
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        title="移动指标"
        avatar={
          <img
            alt="indicator"
            style={{ width: 56, height: 56 }}
            src="https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png"
          />
        }
        action={
          <Tooltip title="指标说明">
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={() => yuan(126560)}
      />
    </Col>


    <Col {...topColResponsiveProps}>
      <ChartCard
        title="移动指标"
        avatar={
          <img
            style={{ width: 56, height: 56 }}
            src="https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png"
            alt="indicator"
          />
        }
        action={
          <Tooltip title="指标说明">
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={() => yuan(126560)}
        footer={
          <Field label="日均销售额" value={numeral(12423).format("0,0")} />
        }
      />
    </Col>

  </Row>

));

export default ChartCard1;
