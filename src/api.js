import axios from 'axios';
import Deserialiser from 'deserialise-jsonapi';
import pickBy from 'lodash.pickby';
import isEmpty from 'lodash.isempty';
import qs from 'query-string';
import { Promise } from 'es6-promise';

const deserialiser = new Deserialiser();

// const API_BASEURL = process.env.REACT_APP_API_BASEURL;
const API_BASEURL = 'https://api.cellmodelpassports.sanger.ac.uk';
const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

function getToken() {
  return axios({
    method: 'POST',
    url: '/login',
    data: {
      username: 'emepyc@gmail.com',
      password: 'SNU-C2B'
    },
    headers: {
      'Content-Type': 'application/json'
    },
    baseURL: API_BASEURL,
  });
}

function paramsSerializer(params) {
  params.agg = params.agg ? JSON.stringify(params.agg) : undefined;
  params.filter = params.filter ? JSON.stringify(params.filter) : undefined;
  return qs.stringify(params, { depth: 0 });
}

export function post(endpoint, data) {
  return getToken().then(response => {
    return axios.post(
      `${API_BASEURL}/${endpoint}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${response.data.accessToken}`
        }
      }
    );
  });
}

export function get(endpoint, params = {}) {
  return getToken().then(response => {
    return axios.get(
      `${API_BASEURL}/${endpoint}`,
      {
        params,
        paramsSerializer,
        headers: {
          Authorization: `Bearer ${response.data.accessToken}`
        }
      }
    );
  });
}

function geneEssentialities(gene, filters) {
  console.log(gene);
  console.log(filters);
  return get(`genes/${gene}/datasets/crispr_ko`, {
    sort: 'fc_clean',
    filter: filters,
    'page[size]': 0
  })
}

function geneInfo(gene) {
  return get(`genes/${gene}`);
}

function tissues() {
  return get('models', {
    'page[size]': 1,
    agg: {
      'sample.tissue.name': 'count'
    },
    filter: [
      {
        name: 'crispr_ko_available',
        op: 'eq',
        val: 'true'
      }
    ]
  })
    .then(resp => {
      return resp.data.meta.agg['sample.tissue.name'].count;
    })
    .then(data => {
      return pickBy(data, (count) => {
        return count > 0;
      });
    });
}

function tissuesFromModels(models) {
  return models.reduce((acc, curr) => {
    const tissue = curr.sample.tissue.name;
    return {
      ...acc,
      [tissue]: true
    };
  }, {});
}

function search(query) {
  const genesPromise = get('genes', {
    filter: [{ name: 'symbol', op: 'ilike', val: `${query}%` }]
  }).then(resp => resp.data.data.slice(0, 5));

  const modelsPromise = get(`search/${query}`, {
    include: 'sample.tissue'
  })
    .then(resp => deserialiser.deserialise(resp.data))
    .then(data => data.slice(0, 5));

  const cancerTypesPromise = get('models', {
    include: 'sample.tissue',
    filter: [
      {
        name: 'sample',
        op: 'has',
        val: {
          name: 'cancer_type',
          op: 'has',
          val: {
            name: 'name',
            op: 'ilike',
            val: `${query}%`
          }
        }
      }
    ]
  })
    .then(resp => deserialiser.deserialise(resp.data))
    .then(data => data.slice(0, 5));

  return axios
    .all([genesPromise, modelsPromise, cancerTypesPromise])
    .then(resps => {
      const geneSuggestions = resps[0].length ? resps[0] : [];

      const modelSuggestions = [
        ...(resps[1].length ? resps[1] : []),
        ...(resps[2].length ? resps[2] : [])
      ];

      // const tissuesSuggestions = getMatchingTissues(query.toLowerCase());
      const tissuesInModels = tissuesFromModels(modelSuggestions);
      const tissuesSuggestionsWithType = modelSuggestions.map(tissue => {
        return { ...tissue, type: 'tissue' };
      });
      const suggestions = [
        geneSuggestions.length
          ? { title: 'Genes', items: geneSuggestions }
          : {},
        modelSuggestions.length
          ? { title: 'Models', items: modelSuggestions }
          : {},
        tissuesSuggestionsWithType.length
          ? {
              title: 'Tissues',
              items: Object.keys(tissuesInModels).map(tissue => ({
                type: 'tissue',
                name: tissue
              }))
            }
          : {}
      ];

      const suggestionsNotEmpty = suggestions.filter(
        suggestion => !isEmpty(suggestion)
      );
      console.log(suggestionsNotEmpty);
      return suggestionsNotEmpty;
    });
}

function modelsInTissue(tissue) {
  return get('/models', {
    filter: [{name: 'tissue', op: 'eq', val: tissue}],
    'page[size]': 0
  });
}

function expandParams(params) {
  if (params.tissue) {
    // TODO: this is the reverse of the process happened when fetching the tissues data. There may be better alternatives to just substituting back and forth
    const tissueClean = params.tissue.split('_').join(' ');
    return modelsInTissue(tissueClean)
      .then(resp => ({
          ...params,
          model: [
            ...(params.model || []),
            ...resp.data.data.map(rec => rec.attributes.model_name)
          ],
        })
      )
  }
  return Promise.resolve(params);
}

export const apiFetch = {
  tissues: options => tissues(options),
  search: query => search(query),
  geneInfo: gene => geneInfo(gene),
  geneEssentialities: (gene, tissue) => geneEssentialities(gene, tissue),
  expandParams: params => expandParams(params),
};
