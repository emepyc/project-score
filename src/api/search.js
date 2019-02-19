import {get} from "./index";
import Deserialiser from 'deserialise-jsonapi';
import axios from 'axios';
import isEmpty from 'lodash.isempty';

const deserialiser = new Deserialiser();

export default function search(query) {
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
      const geneSuggestionsWithLabel = geneSuggestions.map(gene => ({
        ...gene,
        label: gene.attributes.symbol,
      }));

      const modelSuggestions = [
        ...(resps[1].length ? resps[1] : []),
        ...(resps[2].length ? resps[2] : [])
      ];

      const modelSuggestionsWithLabel = modelSuggestions.map(model => ({
        ...model,
        label: model.names[0],
        tissue: model.sample.tissue.name,
      }));

      const tissuesInModels = tissuesFromModels(modelSuggestionsWithLabel);
      const suggestions = [
        geneSuggestionsWithLabel.length
          ? { title: 'Genes', options: geneSuggestionsWithLabel }
          : {},
        modelSuggestions.length
          ? { title: 'Models', options: modelSuggestionsWithLabel }
          : {},
        modelSuggestionsWithLabel.length
          ? {
              title: 'Tissues',
              options: Object.keys(tissuesInModels).map(tissue => ({
                type: 'tissue',
                name: tissue,
                label: tissue,
              }))
            }
          : {}
      ];

      return suggestions.filter(
        suggestion => !isEmpty(suggestion)
      );
    });
}

function tissuesFromModels(models) {
  return models.reduce((acc, curr) => {
    const tissue = curr.tissue;
    return {
      ...acc,
      [tissue]: true
    };
  }, {});
}
