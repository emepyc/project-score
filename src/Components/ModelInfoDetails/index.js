import classNames from 'classnames';
import partition from 'lodash.partition';
import React, {Fragment, useState} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Row, Col, Tooltip} from 'reactstrap';
import {fetchCrisprData, fetchModelDetails} from '../../api';
import useUrlParams from '../useUrlParams';
import ModelDatasetIcon from '../../modelDatasetIcons';
import FetchData from "../FetchData";
import {FitnessScoreSource} from "../TableDisplay";

import style from './modelInfoDetails.module.scss';

function ModelInfoDetails(props) {
  const [urlParams] = useUrlParams(props);

  return (
    <FetchData
      endpoint={fetchModelDetails}
      params={{modelId: urlParams.modelId}}
      deps={[urlParams.modelId]}
    >
      {modelInfo => {
        const [driverGenesWithEssentialities, driverGenesWithoutEssentialities] = partition(
          modelInfo.drivers, driverGene => driverGene.hasEssentialityProfiles,
        );

        const ploidy = modelInfo.ploidy ? modelInfo.ploidy.toFixed(3): 'N/A';
        const mutationsPerMb = modelInfo.mutationsPerMb ? modelInfo.mutationsPerMb.toFixed(3) : 'N/A';
        return (
          <div className='mx-3'>
            <Row>
              <Col xs={{size: 12}} lg={{size: 6}}>
                <div>Tissue <span className={style.infoItem}>{modelInfo.tissue}</span></div>
                <div>Cancer type <span className={style.infoItem}>{modelInfo.cancerType}</span></div>
                <div>Analyses{' '}
                  {modelInfo.analyses.map(analysis => (
                    <Analysis key={analysis.id} analysis={analysis}/>
                  ))}
                </div>
                <div>MSI status <span className={style.infoItem}>{modelInfo.msiStatus}</span></div>
                <div>Ploidy <span className={style.infoItem}>{ploidy}</span></div>
                <div>Mutations per MB <span className={style.infoItem}>{mutationsPerMb}</span></div>
                <div>Driver genes:</div>
                <div className="ml-2">with fitness data:
                  {driverGenesWithEssentialities.map(
                    driverGene => (
                      <CancerDriverGene
                        key={driverGene.id}
                        driverGene={driverGene}
                      />
                    )
                  )}</div>
                <div className="ml-2">not a fitness gene:
                  {driverGenesWithoutEssentialities.map(
                    driverGene => (
                      <CancerDriverGene
                        key={driverGene.id}
                        driverGene={driverGene}
                      />
                    )
                  )}</div>
              </Col>
              <Col xs={{size: 12}} lg={{size: 6}} className='border-left'>
                <Row>
                  <Col>
                  <ModelDatasets datasets={modelInfo.datasets} modelId={modelInfo.id}/>
                  </Col>
                </Row>
                <Row className='mt-3'>
                  <Col>
                    <FitnessDataSource
                      modelId={modelInfo.id}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        );
      }}
    </FetchData>
  );
}

export default withRouter(ModelInfoDetails);

function FitnessDataSource({modelId}) {
  return (
    <Fragment>
      <div style={{fontWeight: 'bold'}} className='mb-3'>Fitness data source:</div>
      <FetchData
        endpoint={fetchCrisprData}
        params={{
          modelId,
          pageSize: 1,
        }}
        deps={[modelId]}
      >
        {data => {
          return (<FitnessScoreSource source={data.data[0].source}/>);
        }}
      </FetchData>
    </Fragment>
  );
}

function Analysis({analysis}) {
  const classes = classNames(style.infoItem, {
    "mx-1": true,
    "d-inline-block": true,
  });
  return (
    <div className={classes}>
      <Link to={`/table?analysis=${analysis.id}`}>
        {analysis.name}
      </Link>
    </div>
  );
}

function CancerDriverGene({driverGene}) {
  const cancerDriverLabel = driverGene.hasEssentialityProfiles ? (
    <Link to={`/gene/${driverGene.id}`}>
      {driverGene.symbol}
    </Link>
  ) : (<Fragment>{driverGene.symbol}</Fragment>);

  const classes = classNames(style.infoItem, {
    "mx-1": true,
    "d-inline-block": true,
  });

  return (
    <div className={classes}>
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
      <div style={{fontWeight: 'bold'}} className='mb-3'>Additional cell model datasets:</div>

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
