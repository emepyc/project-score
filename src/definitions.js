export const foldChangeHelp = 'Negative values indicate depletion of gene; gene averaged sgRNA representation at the beginning versus end of the experiment.';
export const lossOfFitnessScoreHelp = 'Score < 0 is a statistically significant effect; values are scaled Bayes Factors calculated using BAGEL.';
export const priorityScoresHelp = {
  classAmarker: 'Boolean value specifying if a genomic marker for the essentiality of the gene under consideration (at an ANOVA test pvalue < 0.001, and FDR < 25% [5% for MSI] and both Glass Deltas > 1) does exists',
  classBmarker: 'Boolean value specifying if a genomic marker for the essentiality of the gene under consideration (at an ANOVA test pvalue < 0.001, and (for Pan-Cancer results) at least one Glass Delta (quantifying the effect size) > 1) does exist',
  classCmarker: 'Boolean value specifying if the gene under consideration is a High confidence cancer type specific cancer driver gene (as defined in <a href="https://www.ncbi.nlm.nih.gov/pubmed/27397505" target="_blank" rel="noreferrer noopener">Iorio et al, 2016</a>)',
  highConfidenceDriver: 'Boolean value specifying if the gene under consideration is a High confidence cancer driver gene (as defined in <a href="https://www.ncbi.nlm.nih.gov/pubmed/27397505" target="_blank" rel="noreferrer noopener">Iorio et al, 2016</a>)',
  mutatedInPrimaryTumors: 'Boolean value specifying if the gene under consideration is mutated in at least 2% of primary tumours matched to the cancer type under consideration',
  cosmicVariantInPrimaryTumors: 'Boolean value specifying if the gene under consideration is mutated in at least 2% of primary tumours matched to the cancer type under consideration hosting a variant included in COSMIC (<a href="https://www.ncbi.nlm.nih.gov/pubmed/27899578" target="_blank" rel="noreferrer noopener">Forbes et al, 2017</a>)',
  weakerMarker: 'Boolean value specifying if a genomic marker for the essentiality of the gene under consideration (at a t-test pvalue < 0.05, and (for Pan-Cancer results) at least one Glass Delta (quantifying the effect size) > 1) does exist',
  significantFitnessGene: 'Boolean value specifying if the gene under consideration is a significant fitness gene for the cell line (BAGEL FDR < 5%)',
  enrichedPathway: 'Boolean value specifying if the gene under consideration belong to a biological pathway that is statistically over-represented among the fitness genes in the cell line (adjusted hypergeometric p-value < 0.05)',
  fitnessScoreFold1: 'Boolean value specifying if the gene under consideration is a fitness gene in the cell line (at a BAGEL scaled Bayesian Factor > 1)',
  fitnessScoreFold2: 'Boolean value specifying if the gene under consideration is a fitness gene in thecell line (at a BAGEL scaled Bayesian Factor > 2)',
  fitnessScoreFold3: 'Boolean value specifying if the gene under consideration is a fitness gene in the cell line (at a BAGEL scaled Bayesian Factor > 3)',
  highlyExpressed: 'Boolean value specifying if the gene under consideration is highly expressed at the basal level in the cell line (FPKM > 90% quantile)',
  homozygousDeletion: 'Boolean value specifying if the gene under consideration is homozigously copy number deleted in the cell line (FPKM < 0.05)',
  mageck10fdr: 'Boolean value specifying if the gene under consideration is a fitness gene in the cell line (at a MAGeCK FDR < 10%)',
  mageck5fdr: 'Boolean value specifying if the gene under consideration is a fitness gene in the cell line (at a MAGeCK FDR < 5%)',
  mutated: 'Boolean value specifying if the gene under consideration is somatically mutated in the cell line',
  notExpressed: 'Boolean value specifying if the gene under consideration is not expressed at the basal level in the cell line (FPKM < 0.05)',
};
