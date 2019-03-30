import React from 'react';

function datasetIcon(dataset) {
  if (dataset === "CNV") {
    return (
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
           x="0px" y="0px"
           viewBox="0 0 600 600" style={{enableBackground: "new 0 0 600 600"}} xmlSpace="preserve">
        <polygon className="st0" points="485,291 134,291 134,111 116,111 116,489 134,489 134,309 485,309 "/>
        <rect x="144" y="317" className="st0" width="54" height="63"/>
        <rect x="198" y="128" className="st0" width="54" height="153"/>
        <rect x="252" y="317" className="st0" width="54" height="153"/>
        <polygon className="st0" points="360,200 360,245 306,245 306,281 360,281 414,281 414,200 "/>
        <rect x="414" y="317" className="st0" width="54" height="126"/>
      </svg>
    );
  }
  if (dataset === "MET") {
    return (
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
           x="0px" y="0px"
           viewBox="0 0 600 600" style={{enableBackground: "new 0 0 600 600"}} xmlSpace="preserve">
        <path className="st0" d="M533,184l-8.9-10.6c0,0-10.1,25.9-14.9,36c-42.5,89.2-76.1,42.4-148.6,18.9c-3.6-1.2-7.4-2.3-11.5-3.3
	c0.2-18.6,1.4-35.1,5.8-49.5l23.4,40.5l30.1-17.4l-32.9-56.9c8.9-8.3,20.6-15.5,36.2-21.7l53.6,92.9l30.1-17.4l-49.6-86
	c7-1.7,14.5-3.2,22.6-4.7L451,84.1c-132.1-16.9-137.3,65-136.7,134.7c-78.4-8.7-190.2,12.8-196.4,142.7l17.4,20.7
	c37.8-102.4,105-139.5,179.3-135.6c0,3.7,0,7.4-0.1,10.9c-1.1,40.1,1.8,73.5-1.3,101l-23.7-41.1l-30.1,17.4l39.1,67.8
	c-7.8,11.2-19.2,20.9-35.9,29l-54-93.5l-30.1,17.4l51,88.3c-10.2,2.8-21.5,5.4-34.2,7.7C198,456,204,463,204,463s5,6,8.6,9.1
	c157.9,20.2,134.5-101.3,136.5-173.3c0.5-17.1,0.2-33,0-47.7c13.3,2.8,26.8,6.7,40.3,11.7c68.1,25.1,129.9,89,152-68.7
	C539,191,533,184,533,184z"/>
        <path className="st1" d="M212.8,204.4c-27.5,6.8-44.9,13.9-55.2,21.5c-9.7,7.2-26.4,22.7-36.4,46.2c-37.1-6.5-74.8-44.1-67.7-91.5
	c6.6-44,47.5-74.3,91.5-67.7S219.4,160.4,212.8,204.4z"/>
      </svg>
    )
  }

  if (dataset === "RNA") {
    return (
      <div style={{fontWeight: "bold"}}>RNAseq</div>
    )
  }

  if (dataset === "MGE") {
    return (
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
           x="0px"
           y="0px"
           viewBox="0 0 600 600" style={{enableBackground: "new 0 0 600 600"}} xmlSpace="preserve">
        <polygon className="st0" points="129,471 129,111 111,111 111,489 119,489 129,489 488,489 488,471 "/>
        <rect x="240" y="293" className="st0" width="67" height="67"/>
        <rect x="240" y="111" className="st0" width="67" height="67"/>
        <rect x="240" y="386" className="st0" width="67" height="67"/>
        <rect x="330" y="203" className="st0" width="67" height="67"/>
        <rect x="330" y="293" className="st0" width="67" height="67"/>
        <rect x="330" y="111" className="st0" width="67" height="67"/>
        <rect x="330" y="386" className="st0" width="67" height="67"/>
        <rect x="422" y="203" className="st0" width="67" height="67"/>
        <rect x="422" y="111" className="st0" width="67" height="67"/>
        <rect x="422" y="386" className="st0" width="67" height="67"/>
        <rect x="147" y="203" className="st0" width="67" height="67"/>
        <rect x="147" y="293" className="st0" width="67" height="67"/>
        <rect x="147" y="111" className="st0" width="67" height="67"/>
      </svg>
    );
  }

  if (dataset === "CNV") {
    return (
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
           x="0px" y="0px"
           viewBox="0 0 600 600" style={{enableBackground: "new 0 0 600 600"}} xmlSpace="preserve">
        <path className="st0" d="M505.6,214.2c0,0-10.3-17.2-11.6-13.8c-5.1,13.9-10.1,25.9-14.9,36c-0.1,0.1-0.1,0.3-0.2,0.4L434.6,160
	l-30.1,17.4l53.8,93.2c-17.5,20.5-34.8,21.1-55.6,14.1l-50-85.8l-30.1,17.4l26.3,45.6c-5.8-2.3-11.9-4.6-18.2-6.6
	c-69-22.4-235-25.9-242.6,133.2l17.4,20.7c6.3-17.2,13.5-32.6,21.4-46.2l45.6,78.9l30.1-17.4l-53.7-93c12.7-15,26.6-26.8,41.5-35.8
	l33.8,58.5l30.1-17.4L222,281.2c42.4-13.7,90-8.9,137.5,8.6c68.1,25.1,144.5,90.4,152-68.7C511.6,217.4,505.6,214.2,505.6,214.2z"/>
      </svg>
    );
  }

  if (dataset === "DRUG") {
    return (
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
           x="0px" y="0px"
           viewBox="0 0 600 600" style={{enableBackground: "new 0 0 600 600"}} xmlSpace="preserve">
        <path d="M463,132.8c-16-16-37.1-24.3-61.4-24.3c-28.9,0.1-59.9,12.7-79.2,32.1c-36.9,37.3-61.7,62.3-85.6,86.2l-1,1
          c-1.8,1.8-3.3,3.3-5.1,5.1c-63.2,63.1-79,78.7-90.5,90c-3.1,3-5.9,5.8-9.2,9.1c-30.4,30.1-36.7,89.5,2.2,130.2
          c19.4,20.3,40.3,30.7,62,31c0.3,0,0.7,0,1,0c22,0,44.4-10.7,65-30.9c61.6-60.6,101-100.3,139-138.7c19-19.2,38.7-39,60.8-61.2
          c16.7-16.7,27-39.3,28.3-62.1C490.9,175.3,481.5,151.3,463,132.8z M247.2,448.2c-11.7,11.5-30,25.1-50.9,25.1c-0.2,0-0.5,0-0.7,0
          c-16.2-0.2-32.3-8.6-47.8-24.9c-18.7-19.6-22-41.1-21.5-55.6c0.7-18,7.7-35.4,18.9-46.5l0,0c3.3-3.3,6.1-6.1,9.2-9.1
          c11.4-11.2,27-26.6,88.5-88l102,102C317.8,378.3,287.2,408.9,247.2,448.2z"/>
      </svg>
    );
  }

  if (dataset === "WES") {
    return (
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
           x="0px" y="0px"
           viewBox="0 0 600 600" style={{enableBackground: 'new 0 0 600 600'}} xmlSpace="preserve">
        <path className="st0" d="M505.6,209.2c0,0-10.3-17.2-11.6-13.8c-5.1,13.9-10.1,25.9-14.9,36c-42.5,89.2-76.1,42.4-148.6,18.9
            c-3.6-1.2-7.4-2.3-11.5-3.3c0.2-18.6,1.4-35.1,5.8-49.5l23.4,40.5l30.1-17.4l-32.9-56.9c8.9-8.3,20.6-15.5,36.2-21.7l53.6,92.9
            l30.1-17.4l-49.6-86c7-1.7,14.5-3.2,22.6-4.7L421,106.1c-132.1-16.9-137.3,65-136.7,134.7c-78.4-8.7-190.2,12.8-196.4,142.7
            l17.4,20.7c37.8-102.4,105-139.5,179.3-135.6c0,3.7,0,7.4-0.1,10.9c-1.1,40.1,1.8,73.5-1.3,101l-23.7-41.1l-30.1,17.4l39.1,67.8
            c-7.8,11.2-19.2,20.9-35.9,29l-54-93.5l-30.1,17.4l51,88.3c-10.2,2.8-21.5,5.4-34.2,7.7c-3.6,0.6,11.6,13.8,11.6,13.8
            s2.1,6.4,5.8,6.9c157.9,20.2,134.5-101.3,136.5-173.3c0.5-17.1,0.2-33,0-47.7c13.3,2.8,26.8,6.7,40.3,11.7
            c68.1,25.1,144.5,90.4,152-68.7C511.6,212.4,505.6,209.2,505.6,209.2z"/>
      </svg>
    );
  }
}

export default function ModelDatasetIcon({dataset, modelId}) {
  const icon = datasetIcon(dataset.abbreviation);

  const cellPassportLink = `https://cellmodelpassports.sanger.ac.uk/passports/${modelId}`;

  const iconLabel = dataset.modelHasDataset ? (
    <a href={cellPassportLink} target='_blank' rel='noopener noreferrer'>
      {icon}
    </a>
  ) : (<span>{icon}</span>);

  return (
    <div
      style={{
        width: '40px',
        height: '40px',
        display: 'inline-block',
        margin: '0 5px',
        opacity: dataset.modelHasDataset ? 1 : 0.3,
        fill: dataset.modelHasDataset ? '#007bff' : '#000000',
      }}
    >
      {iconLabel}
    </div>
  )
}
