import qs from 'query-string';
import debounce from 'lodash.debounce';
import isObject from 'lodash.isobject';

export function sanitiseParams(params) {
  return Object.keys(params).reduce((acc, curr) => {
    return isObject(params[curr]) ? {
      ...acc,
      [curr]: JSON.stringify(params[curr]),
    } : {
      ...acc,
      [curr]: params[curr],
    };
  }, {});
}

const _setUrlParams = (history, urlParams, newParams) => {
  const sanitisedUrlParams = sanitiseParams({
    ...urlParams,
    ...newParams,
  });
  history.push({
    search: `?${qs.stringify(sanitisedUrlParams)}`,
  });
};

const _deferredSetUrlParams = debounce(_setUrlParams, 500);


function useUrlParams(props) {
  const {tissue, scoreMin, scoreMax} = qs.parse(props.location.search);
  const {geneId, modelId} = props.match.params;

  const urlParams = {
    tissue,
    scoreMin,
    scoreMax,
    geneId,
    modelId,
  };

  const setUrlParams = (newParams) =>
    _setUrlParams(props.history, urlParams, newParams);

  const deferredSetUrlParams = (newParams) =>
    _deferredSetUrlParams(props.history, urlParams, newParams);

  return [
    urlParams,
    setUrlParams,
    deferredSetUrlParams,
  ];
}

export default useUrlParams;
