import React from 'react';
import style from './pageHeader.module.scss';

function PageHeader({header, subheader}) {
  return (
    <div className={style.header}>
      <h2>{header}</h2>
      <div>{subheader}</div>
    </div>
  )

}

export default PageHeader;
