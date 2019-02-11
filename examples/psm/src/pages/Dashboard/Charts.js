import React, { memo } from 'react';
import { Row, Col } from 'antd';

import ChartsBar from './ChartsBar';
import ChartsGauge from './ChartsGauge';
import ChartsRadar from './ChartsRadar';
import ChartsArea from './ChartsArea';
import ChartsPie from './ChartsPie';
import ChartsProgress from './ChartsProgress';
import ChartsWaterWave from './ChartsWaterWave';
import ChartsTimelineChart from './ChartsTimelineChart';
import ChartsTagCloud from './ChartsTagCloud';




const ChartCard1 = memo(() => (
  <Row gutter={24}>
    <Col >
      <ChartsBar />
    </Col>

    <Col >
      <ChartsGauge/>
    </Col>

    <Col>
      <ChartsRadar />
    </Col>

    <Col ><ChartsArea/>
    </Col>

    <Col ><ChartsPie/>
    </Col>

    <Col ><ChartsProgress/>
    </Col>
    <Col >
      <ChartsTagCloud />
    </Col>

    <Col >
      <ChartsWaterWave />
    </Col>
    <Col >
      <ChartsTimelineChart />
    </Col>




  </Row>

));

export default ChartCard1;
