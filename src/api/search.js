import {get} from "./index";

function formatResponse(resp) {
  const data = resp;
  const options = [
    {
      type: "genes",
      label: "Genes",
      extraOptions: gene => ({
        label: gene.symbol,
        id: gene.id,
      })
    },
    {
      type: "models",
      label: "Models",
      extraOptions: model => ({
        label: model.names[0],
        id: model.id,
        tissue: model.tissue,
      }),
    },
    {
      type: "cancer_types",
      label: "Cancer types",
      extraOptions: cancerType => ({
        label: cancerType.name,
        id: cancerType.id,
      }),
    },
  ];

  return options.reduce((suggestions, suggestionType) => {
    const {type, label, extraOptions} = suggestionType;
    if (data[type]) {
      return [...suggestions, {
        label: label,
        options: data[type].hits.map(option => ({
          ...extraOptions(option),
          type,
        }))
      }];
    }
    return suggestions;
  }, []);
}

export default function search(query) {
  return get(`/score_search/${query}`)
    .then(formatResponse);
}
