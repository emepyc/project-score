import React, {Fragment} from 'react';
import {PulseLoader} from 'react-spinners';
import {SizeMe} from 'react-sizeme';

function Spinner({loading, style, children, ...spinnerParams}) {
  if (!loading) {
    return (
      <div>
        {children}
      </div>
    )
  }

  return (
    <div style={{position: 'relative'}}>
      <SizeMe
        monitorHeight
      >
        {({size: containerSize}) => (
          <Fragment>
            <div>
              {children}
            </div>
            <RenderSpinner
              style={style}
              containerSize={containerSize}
              loading={loading}
              {...spinnerParams}
            />
          </Fragment>
        )}
      </SizeMe>
    </div>
  );
}

function RenderSpinner({containerSize, style, loading, ...spinnerParams}) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        opacity: 0.9,
        display: loading ? 'block': 'none',
        ...style
      }}
    >
      <div
        className='text-center align-middle'
        style={{
          position: 'absolute',
          top: `${(containerSize.height / 2) - 8}px`,
          left: `${(containerSize.width / 2) - 25}px`
        }}
      >
        <PulseLoader
          sizeUnit={'px'}
          size={15}
          color={'#469D32'}
          loading={loading}
          {...spinnerParams}
        />
      </div>
    </div>
  )
}

export default Spinner;
