import axios from 'axios';
// import Deserialiser from 'deserialise-jsonapi';
// import pickBy from 'lodash.pickby';
import qs from 'query-string';
// import { Promise } from 'es6-promise';


const API_BASEURL = process.env.REACT_APP_API_BASEURL;
const USERNAME = process.env.REACT_APP_API_USERNAME;
const PASSWORD = process.env.REACT_APP_API_PASSWORD;


function getToken() {
  return axios({
    method: 'POST',
    url: '/login',
    data: {
      username: USERNAME,
      password: PASSWORD,
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

// function geneEssentialities(gene, filters) {
//   console.log(gene);
//   console.log(filters);
//   return get(`genes/${gene}/datasets/crispr_ko`, {
//     sort: 'fc_clean',
//     filter: filters,
//     'page[size]': 0
//   })
// }
//
// function geneInfo(gene) {
//   return get(`genes/${gene}`);
// }

// function tissues() {
//   return get('models', {
//     'page[size]': 1,
//     agg: {
//       'sample.tissue.name': 'count'
//     },
//     filter: [
//       {
//         name: 'crispr_ko_available',
//         op: 'eq',
//         val: 'true'
//       }
//     ]
//   })
//     .then(resp => {
//       return resp.data.meta.agg['sample.tissue.name'].count;
//     })
//     .then(data => {
//       return pickBy(data, (count) => {
//         return count > 0;
//       });
//     });
// }


// function search(query) {
//   const genesPromise = get('genes', {
//     filter: [{ name: 'symbol', op: 'ilike', val: `${query}%` }]
//   }).then(resp => resp.data.data.slice(0, 5));
//
//   const modelsPromise = get(`search/${query}`, {
//     include: 'sample.tissue'
//   })
//     .then(resp => deserialiser.deserialise(resp.data))
//     .then(data => data.slice(0, 5));
//
//   const cancerTypesPromise = get('models', {
//     include: 'sample.tissue',
//     filter: [
//       {
//         name: 'sample',
//         op: 'has',
//         val: {
//           name: 'cancer_type',
//           op: 'has',
//           val: {
//             name: 'name',
//             op: 'ilike',
//             val: `${query}%`
//           }
//         }
//       }
//     ]
//   })
//     .then(resp => deserialiser.deserialise(resp.data))
//     .then(data => data.slice(0, 5));
//
//   return axios
//     .all([genesPromise, modelsPromise, cancerTypesPromise])
//     .then(resps => {
//       const geneSuggestions = resps[0].length ? resps[0] : [];
//
//       const modelSuggestions = [
//         ...(resps[1].length ? resps[1] : []),
//         ...(resps[2].length ? resps[2] : [])
//       ];
//
//       // const tissuesSuggestions = getMatchingTissues(query.toLowerCase());
//       const tissuesInModels = tissuesFromModels(modelSuggestions);
//       const tissuesSuggestionsWithType = modelSuggestions.map(tissue => {
//         return { ...tissue, type: 'tissue' };
//       });
//       const suggestions = [
//         geneSuggestions.length
//           ? { title: 'Genes', items: geneSuggestions }
//           : {},
//         modelSuggestions.length
//           ? { title: 'Models', items: modelSuggestions }
//           : {},
//         tissuesSuggestionsWithType.length
//           ? {
//               title: 'Tissues',
//               items: Object.keys(tissuesInModels).map(tissue => ({
//                 type: 'tissue',
//                 name: tissue
//               }))
//             }
//           : {}
//       ];
//
//       const suggestionsNotEmpty = suggestions.filter(
//         suggestion => !isEmpty(suggestion)
//       );
//       console.log(suggestionsNotEmpty);
//       return suggestionsNotEmpty;
//     });
// }


// export const apiFetch = {
//   tissues: tissues,
//   search: query => search(query),
//   geneInfo: gene => geneInfo(gene),
//   geneEssentialities: (gene, tissue) => geneEssentialities(gene, tissue),
//   expandParams: params => expandParams(params),
// };
