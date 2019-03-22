import React, {useState, useEffect} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {fetchModelDetails} from '../../api';
import useUrlParams from '../useUrlParams';
import Spinner from '../Spinner';

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
      });
  }, []);

  return (
    <Spinner loading={loading}>
      <div className='mx-3 my-3'>
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
  ) : (<span>{driverGene.symbol}</span>);

  return (
    <span
      style={{
        marginLeft: '5px',
        marginRight: '5px'
      }}
      className={style.infoItem}
    >
      {cancerDriverLabel}
    </span>
  );
}
