import React from 'react';
import {Card as BootstrapCard} from 'reactstrap';

function Card({children}) {
  return (
    <BootstrapCard
      style={{
        padding: '20px',
        paddingBottom: '20px',
        backgroundColor: '#FFFFFF',
        borderRadius: '10px',
        boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
        marginTop: '20px',
        marginBottom: '20px',
      }}
    >
      {children}
    </BootstrapCard>
  );
}

export default Card;
