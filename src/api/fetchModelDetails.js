import {get} from './api';
import axios from 'axios';
import groupBy from 'lodash/groupBy';
import uniqBy from 'lodash/uniqBy';
import sortBy from 'lodash/sortBy';
import Desearialiser from 'deserialise-jsonapi';

const deserialiser = new Desearialiser();

const modelInfoParams = {
  include: 'identifiers,sample,sample.tissue,sample.cancer_type,files',
  'fields[sample]': 'tissue,cancer_type',
};

const cancerDriverParams = {
  include: 'gene',
};

function parseDatasets(files) {
  const availableDatasets = groupBy(files, file => file.meta.data_type_abbr);
  return [
    {
      label: "Copy Number Variation",
      modelHasDataset: availableDatasets.CNV !== undefined,
      abbreviation: "CNV",
    },
    {
      label: "DNA Methylation",
      modelHasDataset: availableDatasets.MET !== undefined,
      abbreviation: "MET",
    },
    {
      label: "Microarray Gene Expression",
      modelHasDataset: availableDatasets.MGE !== undefined,
      abbreviation: "MGE",
    },
    {
      label: "RNAseq",
      modelHasDataset: availableDatasets.RNA !== undefined,
      abbreviation: "RNA",
    },
    {
      label: "Whole Exome Sequencing",
      modelHasDataset: availableDatasets.WES !== undefined,
      abbreviation: "WES",
    }
  ];
}

function processResponses(modelInfo, cancerDrivers) {
  return {
    tissue: modelInfo.sample.tissue.name,
    cancerType: modelInfo.sample.cancer_type.name,
    msiStatus: modelInfo.msi_status,
    ploidy: modelInfo.ploidy,
    mutationsPerMb: modelInfo.mutations_per_mb,
    drivers: sortBy(
      uniqBy(
        cancerDrivers.map(driver => ({
          symbol: driver.gene.symbol,
          id: driver.gene.id,
          hasEssentialityProfiles: driver.gene.essentiality_profiles.length > 0,
        })), cancerDriver => cancerDriver.symbol
      ), ['symbol'], ['asc']
    ),
    datasets: parseDatasets(modelInfo.files),
    id: modelInfo.id,
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
