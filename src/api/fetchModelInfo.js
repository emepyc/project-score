import {get} from './api';
import Desearialiser from 'deserialise-jsonapi';

const deserialiser = new Desearialiser();

const params = {
  include: 'identifiers,sample,sample.tissue,sample.patient,sample.cancer_type',
  'fields[sample]': 'tissue,patient,cancer_type',
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
    cancerType: modelInfo.sample.cancer_type.name,
  }
}

export default function fetchModelInfo({modelId}, ...args) {
  return get(`/models/${modelId}`, params, ...args)
    .then(resp => deserialiser.deserialise(resp))
    .then(processResponse)
}
