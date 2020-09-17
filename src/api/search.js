import {get} from "./index";

function formatResponse(resp, allAnalyses) {
  const data = resp;
  const options = [
    {
      type: "genes",
      label: "Genes",
      extraOptions: gene => ({
        label: gene.symbol,
        id: gene.id,
        status: gene.status,
      })
    },
    {
      type: "models",
      label: "Models",
      extraOptions: model => ({
        label: model.names[0],
        id: model.id,
        tissue: model.tissue,
        status: model.status,
      }),
    },
    {
      type: "cancer_types",
      label: "Cancer types",
      extraOptions: cancerType => getExtraOptionsForCancerType(cancerType, allAnalyses),
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

export default function search(query, allAnalyses) {
  return get(`/score_search/${query}`, {include: 'all'})
    .then(response => formatResponse(response, allAnalyses));
}

function getExtraOptionsForCancerType(cancerType, allAnalyses) {
  const disabledMsg = 'no analysis available';

  if (allAnalyses) {
    const analysis = allAnalyses.find(analysis => analysis.name === cancerType.name);
    return analysis ? {
      label: cancerType.name,
      status: "available",
      id: analysis.id,
    } : {
      label: cancerType.name,
      status: disabledMsg,
    };
  }
  return {
    label: cancerType.name,
    status: disabledMsg,
  };
}
