import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import some from 'lodash.some';
import {
  fetchCrisprData,
  fetchGeneInfo,
  essentialityIsSignificant,
} from '../../api';
import useUrlParams from '../useUrlParams';
import IsPanCancerEssential from '../IsPanCancerEssential';
import SignificantSummaryPlot from '../SignificantSummaryPlot';
import GeneInfoHeader from '../GeneInfoHeader';

function getCancerTypesCounts(attributes) {
  const allCancerTypes =  Object.keys(attributes).filter(
    attribute => attribute.indexOf('adm_status_') > -1
  );
  const significantCancerTypes = allCancerTypes.filter(cancerType => attributes[cancerType] !== null);
  return {
    total: allCancerTypes.length,
    significant: significantCancerTypes.length,
  }
}

function GeneInfoSummary(props) {
  const [totalEssentialities, setTotalEssentialities] = useState(0);
  const [significantEssentialities, setSignificantEssentialities] = useState(0);
  const [totalCancerTypes, setTotalCancerTypes] = useState(0);
  const [significantCancerTypes, setSignificantCancerTypes] = useState(0);
  const [geneNames, setGeneNames] = useState([]);
  const [geneIdentifiers, setGeneIdentifiers] = useState([]);
  const [geneSymbol, setGeneSymbol] = useState("");
  const [isPanCancer, setIsPanCancer] = useState(false);
  const [urlParams] = useUrlParams(props);

  useEffect(() => {
    fetchGeneInfo(urlParams.geneId)
      .then(geneInfo => {
        setIsPanCancer(some(geneInfo.essentiality_profiles, profile => profile.core_fitness_pancan));
        const cancerTypes = getCancerTypesCounts(geneInfo.essentiality_profiles[0]);
        setTotalCancerTypes(cancerTypes.total);
        setSignificantCancerTypes(cancerTypes.significant);
        setGeneIdentifiers(geneInfo.identifiers);
        setGeneNames(geneInfo.names);
        setGeneSymbol(geneInfo.symbol);
      });

    const params = {
      geneId: urlParams.geneId,
      pageSize: 0,
    };
    fetchCrisprData(params)
      .then(resp => {
        const total = resp.count;
        const significant = resp.data.filter(essentialityIsSignificant).length;
        setTotalEssentialities(total);
        setSignificantEssentialities(significant);
      })
  }, []);

  const significantEssentialitiesNumberSuffix = significantEssentialities === 1 ? '' : 's';
  const significantCancerTypesNumberSuffix = significantCancerTypes === 1 ? '' : 's';

  return (
    <div>
      <GeneInfoHeader
        identifiers={geneIdentifiers}
        names={geneNames}
        symbol={geneSymbol}
      />
      <SignificantSummaryPlot
        total={totalEssentialities}
        significant={significantEssentialities}
      >
        Loss of fitness in <b>{significantEssentialities}</b> cell line{significantEssentialitiesNumberSuffix}
      </SignificantSummaryPlot>
      <SignificantSummaryPlot
        total={totalCancerTypes}
        significant={significantCancerTypes}
      >
        Loss of fitness in <b>{significantCancerTypes}</b> cancer type{significantCancerTypesNumberSuffix}
      </SignificantSummaryPlot>
      <IsPanCancerEssential
        isPanCancer={isPanCancer}
      />
    </div>
  )
}

export default withRouter(GeneInfoSummary);
