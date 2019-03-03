import React, {Fragment} from 'react';
import {PulseLoader} from 'react-spinners';
import {SizeMe} from 'react-sizeme';

function Spinner({loading, style, children}) {
  return (
    <div style={{pointerEvents: 'none', position: 'relative'}}>
      <SizeMe
        monitorHeight
      >
        {({size}) => (
          <Fragment>
            <div>
              {children}
            </div>
            <RenderSpinner
              style={style}
              size={size}
              loading={loading}
            />
          </Fragment>
        )}
      </SizeMe>
    </div>
  );
}

function RenderSpinner({size, style, loading}) {
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
          top: `${(size.height / 2) - 8}px`,
          left: `${(size.width / 2) - 25}px`
        }}
      >
        <PulseLoader
          // css={{override}}
          sizeUnit={'px'}
          size={15}
          color={'#469D32'}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default Spinner;
