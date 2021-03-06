export const foldChangeHelp = 'Fold change between average representation of targeting sgRNAs 14 days post-transfection versus plasmid library. Negative and positive values are gene depletion and enrichment, respectively.';
export const lossOfFitnessScoreHelp = 'Score < 0 is a statistically significant effect; values are scaled Bayes Factors calculated using BAGEL.';
export const fitnessScoreSourceHelp = 'Whether the fitness score comes from the Sanger Institute or the Broad Institute';
export const priorityScoresHelp = {
  totalPriorityScore: 'Ranging from 0 to 100, the value nominates promising therapeutic targets based on (1) fitness effects obtained from CRISPR-Cas9 experimental evidence and (2) existence of a genetic biomarker associated with the target',
  classAmarker: 'Positive for a significant and large effect genomic marker of a differential fitness effect in cells (ANOVA test pvalue < 0.001, and FDR < 25% [5% for MSI] and both Glass Deltas [quantifying effect size] > 1)',
  classBmarker: 'Positive for an intermediate significance genomic marker of a differential fitness effect in cells (ANOVA test FDR < 30%, with at least one Glass Delta > 1)',
  classCmarker: 'Positive for a genomic marker of a differential fitness effect in cells (ANOVA test pvalue < 0.001, with at least one Glass Deltas > 1))',
  highConfidenceDriver: 'Positive if the gene under consideration is a High confidence cancer driver gene (as defined in <a href="https://www.ncbi.nlm.nih.gov/pubmed/27397505" target="_blank" rel="noreferrer noopener">Iorio et al, 2016</a>)',
  mutatedInPrimaryTumors: 'Value specifying if the gene is mutated in at least 2% of primary tumours from cancer type ',
  cosmicVariantInPrimaryTumors: 'Value specifying if the gene under consideration is mutated in at least 2% of primary tumours matched to the cancer type under consideration hosting a variant included in COSMIC (<a href="https://www.ncbi.nlm.nih.gov/pubmed/27899578" target="_blank" rel="noreferrer noopener">Forbes et al, 2017</a>)',
  weakerMarker: 'Positive for a weak genomic marker of a differential fitness effect in cells (t-test pvalue < 0.05, and for pan-cancer results at least one Glass Delta > 1)',
  significantFitnessGene: 'Value specifying if the gene under consideration is a significant fitness gene for the cell line (BAGEL FDR < 5%)',
  enrichedPathway: 'Gene is component of a pathway enriched for fitness genes (adjusted hypergeometric pvalue < 0.05)',
  fitnessScoreFold1: 'Measure of cell line fitness effect using BAGEL',
  fitnessScoreFold2: 'Measure of cell line fitness effect using BAGEL',
  fitnessScoreFold3: 'Measure of cell line fitness effect using BAGEL',
  highlyExpressed: 'Value specifying if the gene under consideration is highly expressed at the basal level in the cell line (FPKM > 90% quantile)',
  homozygousDeletion: 'Value specifying if the gene under consideration is homozigously copy number deleted in the cell line (FPKM < 0.05)',
  mageck10fdr: 'Measure of cell line fitness effect  using MAGeCK',
  mageck5fdr: 'Measure of cell line fitness effect  using MAGeCK',
  mutated: 'Value specifying if the gene is mutated in the cell line',
  notExpressed: 'Value specifying if the gene under consideration is not expressed at the basal level in the cell line (FPKM < 0.05)',
  priorityScoreThreshold: '40 is recommended as a minimum threshold for cancer-type specific priority scores, and 55 for pan-cancer priority scores',
  targetPriorityScores: 'Each gene is assigned a score between 0 – 100 (lowest to highest) that integrates gene fitness effects with genomic biomarker and patient data. Scores are calculated for each cancer type and considering all cancer types together in a pan-cancer analysis. Users can use default settings or select input features and group targets by tractability for drug development',
};
