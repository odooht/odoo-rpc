import React, { Component,Suspense } from 'react';


const ChartCards = React.lazy(() => import('./ChartCards'));

class Dashboards extends Component {
  render() {
    return (
      <div>
        <Suspense fallback={null}>
          <ChartCards />
        </Suspense>
      </div>

    );
  }
}

export default Dashboards;


