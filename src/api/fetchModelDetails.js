import {get} from './api';
import groupBy from 'lodash.groupby';
import uniqBy from 'lodash.uniqby';
import sortBy from 'lodash.sortby';
import Desearialiser from 'deserialise-jsonapi';

const deserialiser = new Desearialiser();

const modelInfoParams = {
  include: 'identifiers,sample,sample.tissue,sample.cancer_type,files,analyses',
  'fields[sample]': 'tissue,cancer_type',
  'fields[analysis]': 'name',
};

const cancerDriverParams = {
  include: 'gene',
};

function parseDatasets({datasetFiles: files, drugDataAvailable}) {
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
      label: "Drug Sensitivity Data",
      modelHasDataset: drugDataAvailable,
      abbreviation: "DRUG",
    },
    {
      label: "Whole Exome Sequencing",
      modelHasDataset: availableDatasets.WES !== undefined,
      abbreviation: "WES",
    },
    {
      label: "RNAseq",
      modelHasDataset: availableDatasets.RNA !== undefined,
      abbreviation: "RNA",
    },
  ];
}

function analysesFromModelInfo(analyses) {
  return analyses.map(analysis => ({
    id: analysis.id,
    name: analysis.name,
  }));
}

function processResponses(modelInfo, cancerDrivers) {
  return {
    tissue: modelInfo.sample.tissue.name,
    cancerType: modelInfo.sample.cancer_type.name,
    analyses: analysesFromModelInfo(modelInfo.analyses),
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
    datasets: parseDatasets({
      datasetFiles: modelInfo.files,
      drugDataAvailable: modelInfo.drugs_available,
    }),
    id: modelInfo.id,
  }
}

export default async function fetchModelDetails({modelId}, ...args) {
  const modelInfoPromise = await get(`/models/${modelId}`, modelInfoParams, ...args)
    .then(resp => deserialiser.deserialise(resp));

  const cancerDriversPromise = await get(`/models/${modelId}/datasets/cancer_drivers`, cancerDriverParams)
    .then(resp => deserialiser.deserialise(resp));

  return processResponses(modelInfoPromise, cancerDriversPromise);
}
