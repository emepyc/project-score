import keyBy from 'lodash.keyby'
import groupBy from 'lodash.groupby';
import qs from 'query-string';

// "https://platform-api.opentargets.io/v3/platform/public/evidence/filter?size=10000&datasource=chembl&fields=access_level&fields=disease.efo_info&fields=drug.id&fields=drug.molecule_name&fields=drug.molecule_type&fields=drug.max_phase_for_all_diseases.numeric_index&fields=evidence.target2drug.urls&fields=evidence.target2drug.provenance_type.database.id&fields=evidence.target2drug.provenance_type.literature.references&fields=evidence.target2drug.mechanism_of_action&fields=evidence.target2drug.action_type&fields=evidence.drug2clinic.clinical_trial_phase&fields=evidence.drug2clinic.status&fields=evidence.drug2clinic.urls&fields=target.activity&fields=target.gene_info&fields=target.target_class&target=ENSG00000141736&expandefo=true"

export default async function fetchOtEvidence({ensemblId}) {
  const params = {
    // ?size=10000&datasource=chembl&fields=access_level&fields=drug.max_phase_for_all_diseases.numeric_index&fields=evidence.drug2clinic.clinical_trial_phase&fields=evidence.drug2clinic.status&target=${ensemblId}&expandefo=true`);
    size: 10000,
    datasource: "chembl",
    fields: ["drug.molecule_name", "drug.max_phase_for_all_diseases.numeric_index", "evidence.drug2clinic.clinical_trial_phase"],
    target: ensemblId,
    expandefo: true,
  };

  const queryParams = qs.stringify(params, {depth: 0});

  const otEvidenceResponse = await fetch(
    `https://platform-api.opentargets.io/v3/platform/public/evidence/filter?${queryParams}`,
  );

  const otEvidence = await otEvidenceResponse.json();

  const clinicalTrialsPerPhase = groupBy(otEvidence.data, clinicalTrial =>
    clinicalTrial.evidence.drug2clinic.clinical_trial_phase.numeric_index,
  );

  const clinicalTrialsPerDrugName = keyBy(otEvidence.data, clinicalTrial =>
    clinicalTrial.drug.molecule_name,
  );

  return {
    uniqueDrugs: Object.keys(clinicalTrialsPerDrugName).length,
    clinicalTrialsPerPhase: Object.keys(clinicalTrialsPerPhase).map(phase => ({
      pos: +phase,
      phase,
      label: `Phase ${phaseFromPhase(phase)}`,
      total: clinicalTrialsPerPhase[phase].length,
    }))
  };
}

function phaseFromPhase(phase) {
  if (phase === "0") {
    return "0";
  } else if (phase === "1") {
    return "I";
  } else if (phase === "2") {
    return "II";
  } else if (phase === "3") {
    return "III";
  } else if (phase === "4") {
    return "IV";
  }
}
