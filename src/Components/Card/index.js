import React from 'react';
import {
  Card as BCard,
  CardHeader as BCardHeader,
  CardTitle as BCardTitle,
} from 'reactstrap';

export function Card({children}) {
  return (
    <BCard
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
    </BCard>
  );
}

export function CardHeader({children}) {
  return (
    <BCardHeader
      style={{
        padding: '.3rem .5rem',
        backgroundColor: '#FFFFFF',
      }}
    >
      {children}
    </BCardHeader>
  );
}

export function CardBody({children}) {
  return (
    <div
      style={{
        marginTop: '20px',
      }}
    >
      {children}
    </div>
  );
}

export function CardTitle({children}) {
  return (
    <BCardTitle
      style={{
        fontSize: '1.2rem',
        fontWeight: '400',
      }}
    >
      {children}
    </BCardTitle>
  );
}