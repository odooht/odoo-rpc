import React, { Component,Suspense } from 'react';

const Charts = React.lazy(() => import('./Charts'));

class Dashboards extends Component {
  render() {

    return (

      <div>
        <Suspense fallback={null}>
          <Charts  />
        </Suspense>
      </div>

    );
  }
}

export default Dashboards;


