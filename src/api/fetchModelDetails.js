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
    datasets: parseDatasets({
      datasetFiles: modelInfo.files,
      drugDataAvailable: modelInfo.drugs_available,
    }),
    id: modelInfo.id,
  }
}

export default function fetchModelInfo(modelId) {
  const modelInfoPromise = get(`/models/${modelId}`, modelInfoParams)
    .then(resp => deserialiser.deserialise(resp.data));
    // .then(modelInfo => {
    //   const cosmicIdObject = modelInfo.identifiers.filter(identifier =>
    //     identifier.source.name === 'COSMIC_ID' && identifier.source.public && identifier.source.url_format
    //   )[0];
    //   if (cosmicIdObject) {
    //     const cosmicId = cosmicIdObject.identifier;
    //     return axios.get(`https://www.cancerrxgene.org/api/drugs_response?cosmic_id=${cosmicId}`)
    //       .then(cosmicResp => {
    //         return {
    //           ...modelInfo,
    //           drugDataAvailable: cosmicResp.data.drug_data_available,
    //           drugDataLink: cosmicResp.data.link,
    //         }
    //       })
    //   } else {
    //     return new Promise((resolve) => {
    //       resolve(modelInfo);
    //     })
    //   }
    // });
  const cancerDriversPromise = get(`/models/${modelId}/datasets/cancer_drivers`, cancerDriverParams)
    .then(resp => deserialiser.deserialise(resp.data));

  return axios.all([modelInfoPromise, cancerDriversPromise])
    .then(([modelInfoResponse, cancerDriversResponse]) =>
      processResponses(modelInfoResponse, cancerDriversResponse));
}
