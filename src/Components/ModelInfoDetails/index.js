import React, {Fragment, useState, useEffect} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Row, Col, Tooltip} from 'reactstrap';
import {fetchModelDetails} from '../../api';
import useUrlParams from '../useUrlParams';
import Spinner from '../Spinner';
import ModelDatasetIcon from '../../modelDatasetIcons';

import style from './modelInfoDetails.module.scss';

function ModelInfoSummary(props) {

  const [loading, setLoading] = useState(false);
  const [urlParams] = useUrlParams(props);
  const [tissue, setTissue] = useState('');
  const [cancerType, setCancerType] = useState('');
  const [msiStatus, setMsiStatus] = useState('');
  const [ploidy, setPloidy] = useState('');
  const [mutationsPerMb, setMutationsPerMb] = useState('');
  const [driverGenes, setDriverGenes] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [modelId, setModelId] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchModelDetails(urlParams.modelId)
      .then(modelInfo => {
        setLoading(false);
        setTissue(modelInfo.tissue);
        setCancerType(modelInfo.cancerType);
        setMsiStatus(modelInfo.msiStatus);
        setPloidy(modelInfo.ploidy.toFixed(3));
        setMutationsPerMb(modelInfo.mutationsPerMb.toFixed(3));
        setDriverGenes(modelInfo.drivers);
        setDatasets(modelInfo.datasets);
        setModelId(modelInfo.modelId);
      });
  }, [urlParams.modelId]);

  return (
    <Spinner loading={loading}>
      <div className='mx-3 my-3'>
        <Row>
          <Col xs={{size: 12}} lg={{size: 6}}>
            <div>Tissue <span className={style.infoItem}>{tissue}</span></div>
            <div>Cancer type <span className={style.infoItem}>{cancerType}</span></div>
            <div>MSI status <span className={style.infoItem}>{msiStatus}</span></div>
            <div>Ploidy <span className={style.infoItem}>{ploidy}</span></div>
            <div>Mutations per MB <span className={style.infoItem}>{mutationsPerMb}</span></div>
            <div>Driver genes:
              {driverGenes.map(
                driverGene => (
                  <CancerDriverGene
                    key={driverGene.id}
                    driverGene={driverGene}
                  />
                )
              )}</div>
          </Col>
          <Col xs={{size: 12}} lg={{size: 6}} className='border-left'>
            <ModelDatasets datasets={datasets} modelId={modelId}/>
          </Col>
        </Row>
      </div>
    </Spinner>
  );
}

export default withRouter(ModelInfoSummary);

function CancerDriverGene({driverGene}) {
  const cancerDriverLabel = driverGene.hasEssentialityProfiles ? (
    <Link to={`/gene/${driverGene.id}`}>
      {driverGene.symbol}
    </Link>
  ) : (<Fragment>{driverGene.symbol}</Fragment>);

  return (
    <div
      style={{
        marginLeft: '5px',
        marginRight: '5px',
        display: 'inline-block',
      }}
      className={style.infoItem}
    >
      {cancerDriverLabel}
    </div>
  );
}


function ModelDatasets({datasets, modelId}) {
  const defaultTooltipsState = datasets.reduce((defaultTooltipsState, dataset) => ({
    ...defaultTooltipsState,
    [dataset.abbreviation]: false,
  }), {});

  const [tooltipsOpenState, setTooltipsOpenState] = useState(defaultTooltipsState);

  const toggleTooltipForDataset = abbreviation =>
    setTooltipsOpenState({
      ...tooltipsOpenState,
      [abbreviation]: !tooltipsOpenState[abbreviation],
    });


  return (
    <Fragment>
      <div style={{fontWeight: 'bold'}} className='mb-3'>Available datasets:</div>

      <div>
        {datasets.map(dataset => (
          <div className='d-inline-flex' id={dataset.abbreviation} key={dataset.abbreviation} >
            <ModelDatasetIcon dataset={dataset} modelId={modelId}/>
          </div>
        ))}
      </div>

      {datasets.map(dataset => (
        <Tooltip
          key={dataset.abbreviation}
          placement='right'
          isOpen={tooltipsOpenState[dataset.abbreviation]}
          target={dataset.abbreviation}
          toggle={() => toggleTooltipForDataset(dataset.abbreviation)}
        >
          {dataset.label}
        </Tooltip>
      ))}
    </Fragment>

  );
}
