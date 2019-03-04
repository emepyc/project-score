import {get} from './api';
import Desearialiser from 'deserialise-jsonapi';

const deserialiser = new Desearialiser();

const params = {
  include: 'identifiers,sample,sample.tissue,sample.patient',
  'fields[sample]': 'tissue,patient',
  'fields[tissue]': 'name',
};

function processResponse(modelInfo) {
  return {
    tissue: modelInfo.sample.tissue.name,
    tissueStatus: modelInfo.sample.tissue_status,
    sampleSite: modelInfo.sample.sample_site,
    names: modelInfo.names,
    identifiers: modelInfo.identifiers,
    growthProperties: modelInfo.growth_properties,
  }
}

export default function fetchModelInfo(modelId) {
  return get(`/models/${modelId}`, params)
    .then(resp => deserialiser.deserialise(resp.data))
    .then(processResponse)
    .then(modelInfo => {
      console.log(modelInfo);
      return modelInfo;
    });
}