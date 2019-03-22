import {get} from './api';
import axios from 'axios';
import Desearialiser from 'deserialise-jsonapi';

const deserialiser = new Desearialiser();

const modelInfoParams = {
  include: 'identifiers,sample,sample.tissue,sample.cancer_type',
  'fields[sample]': 'tissue,cancer_type',
};

const cancerDriverParams = {
  include: 'gene',
};

function processResponses(modelInfo, cancerDrivers) {
  return {
    tissue: modelInfo.sample.tissue.name,
    cancerType: modelInfo.sample.cancer_type.name,
    msiStatus: modelInfo.msi_status,
    ploidy: modelInfo.ploidy,
    mutationsPerMb: modelInfo.mutations_per_mb,
    drivers: cancerDrivers.map(driver => ({
      symbol: driver.gene.symbol,
      id: driver.gene.id,
      hasEssentialityProfiles: driver.gene.essentiality_profiles.length > 0,
    })),
  }
}

export default function fetchModelInfo(modelId) {
  const modelInfoPromise = get(`/models/${modelId}`, modelInfoParams)
    .then(resp => deserialiser.deserialise(resp.data));
  const cancerDriversPromise = get(`/models/${modelId}/datasets/cancer_drivers`, cancerDriverParams)
    .then(resp => deserialiser.deserialise(resp.data));

  return axios.all([modelInfoPromise, cancerDriversPromise])
    .then(([modelInfoResponse, cancerDriversResponse]) =>
      processResponses(modelInfoResponse, cancerDriversResponse));
}
