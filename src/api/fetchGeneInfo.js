import {get} from './api';
import Deserialiser from 'deserialise-jsonapi';

const deserialiser = new Deserialiser();

const params = {
  include: 'essentiality_profiles,gene_families,identifiers.source,names',
};

function processResponse(geneInfo) {
  return {
    identifiers: geneInfo.identifiers,
    names: geneInfo.names,
    symbol: geneInfo.symbol,
    isTumourSuppressor: geneInfo.tumour_suppressor,
    isProteasome: geneInfo.essentiality_profiles[0].known_proteasome,
    isRnaPolymerase: geneInfo.essentiality_profiles[0].known_rna_polymerase,
    isRibosomal: geneInfo.essentiality_profiles[0].known_ribosomal,
    isSpliceosome: geneInfo.essentiality_profiles[0].known_spliceosome,
    isHistone: geneInfo.essentiality_profiles[0].known_histones,
    isDnaReplication: geneInfo.essentiality_profiles[0].known_dna_replication,
  }
}

export default function fetchGeneInfo(geneId) {
  return get(`genes/${geneId}`, params)
    .then(resp => deserialiser.deserialise(resp))
    .then(processResponse);
}
