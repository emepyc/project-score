// import {get} from './api';
import {getCancel} from "./api";

function analysisResponseToAnalysis(analysisResponse) {
  console.log("analysisResponse...");
  console.log(analysisResponse);
  return {
    name: analysisResponse.attributes.name,
    id: analysisResponse.id,
    count: analysisResponse.relationships.models.data.length,
  }
}

export default function analyses(params, ...args) {
  return getCancel('analyses', params, ...args)
    .then(resp => resp.data.map(analysisResponseToAnalysis));
}
