import {get} from './api';
import Deserialiser from 'deserialise-jsonapi';

const deserialiser = new Deserialiser();

const params = {
  include: 'essentiality_profiles,gene_families,identifiers.source,names',
};

export default function fetchGeneInfo(geneId) {
  return get(`genes/${geneId}`, params)
    .then(resp => deserialiser.deserialise(resp.data));
}
