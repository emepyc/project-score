import React, {Fragment} from 'react';
import {Container, Nav, NavItem, NavLink} from 'reactstrap';

import './documentation.scss';

export default function Documentation() {
  return (
    <Fragment>
      <Container>
        <div className='d-flex justify-content-center'>
          <Nav>
            <NavItem>
              <NavLink href='#scores'>
                Target priority scores
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href='#experimental'>
                Experimental methods
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href='#glossary'>
                Glossary of terms
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href='#usage'>
                Data usage policy
              </NavLink>
            </NavItem>
          </Nav>
        </div>
        <div className='section'>
          <h1>Project Score</h1>
          <h5>
            Target tractability assessment
          </h5>

          <p className='paragraph'>
            Genetic screens are a powerful approach to investigate gene function and can be used to identify new
            candidate
            cancer drug targets. In Project Score, we are performing systematic genome-scale CRISPR-Cas9 drop-out
            screens
            in a large number of highly-annotated cancer models to identify genes required for cell fitness in defined
            molecular contexts. These results are used to identify dependencies in cancer cells and could inform the
            development of
            new precision cancer medicines. Furthermore, they are a rich resource with applications in basic cell
            biology,
            genome
            engineering and human genetics. These datasets will continue to grow as more data are generated.
          </p>

          <p>
            The Project Score database enables scientist to explore these data using intuitive and interactive
            interfaces.
            Project Score is part of the <a target='_blank' rel='noopener noreferrer'
                                            href="https://depmap.sanger.ac.uk/">Cancer
            Dependency Map</a> at the <a target='_blank' rel='noopener noreferrer'
                                         href="https://www.sanger.ac.uk/">Sanger</a>, which aims
            to
            identify all dependencies in every cancer cell.
          </p>

          <p className='paragraph caption'>
            The Project Score database is part of an ongoing research project and results will be regularly updated.
          </p>
        </div>

        <div className='section'>
          <h2 id="scores">Target priority scores</h2>

          <p className='paragraph'>
            To nominate promising candidate therapeutic targets, we developed a computational framework to
            assign each gene a target priority score that integrates CRISPR knockout gene fitness effects with
            genomic biomarker and patient data (<a target='_blank' rel='noopener noreferrer'
                                                   href='https://pubmed.ncbi.nlm.nih.gov/30971826/'>Behan et al.,
            Nature. 2019</a>). All genes are assigned a target
            priority score between 0 – 100 from lowest to highest priority. Priority scores for a gene are
            calculated individually for each cancer type with at least 10 cell lines and considering all cancer types
            together in a pan-cancer analysis.
          </p>

          <p className='paragraph'>
            Confirmatory studies are required to further evaluate the candidate targets identified here.
          </p>

          <p className='paragraph'>
            The priority score consists of three components described here:
          </p>

          <p className='paragraph'>
            <ol className='paragraph'>
              <li>
                <span className='strong'>Exclusion filter [defining genes with null priority score]</span> - Genes have a priority score of zero
                (or <i>null</i>) if they:
                <ul>
                  <li>were defined as <i>core fitness</i> (i.e. required for the fitness of the majority of cell
                    lines) because as drug targets they have an increased likelihood of toxicity
                  </li>
                  <li>
                    belonged to a prior known set of essential genes, such as Ribosomal proteins genes
                    (defined in <a target='_blank' rel='noopener noreferrer'
                                   href='https://pubmed.ncbi.nlm.nih.gov/30971826/'>Behan et al.,
                    Nature. 2019</a>);
                  </li>
                  <li>
                    are targeted by only 1 sgRNA in the library and so more likely to be false positives.
                  </li>
                </ul>
              </li>
              <li className='paragraph'>
                <span className='strong'>Biomarker &amp; tumour prevalence [30% of the priority score by default]</span> - This component of the
                priority score is based on evidence of a genetic biomarker associated with a target dependency. It
                is proportional to biomarker strength and also accounts for genomic alterations of the target
                occurring in patient tumours of the indicated cancer type at &gt;2% frequency. For the biomarker
                analysis, we performed an analysis of variance (ANOVA) to test associations between the fitness
                effect of gene knockout in cell lines and the presence or absence of 484 cancer driver events, or
                MSI, in each cancer type with sample size (n ≥ 10 cell lines) and pan-cancer. The score is the sum
                of the individual equally weighted components and when combined represent 30% of the total
                score by default.
              </li>
              <li className='paragraph'>
                <span className='strong'>Cell Lines Fitness effect [70% of the priority score by default]</span> - This component of the score is
                the average sum of multiple factors for cell lines in which the gene is a significant fitness gene (at
                a 5% FDR), and is expressed at least at the basal level, and is not homozygously deleted. For each
                cell line under consideration, these factors account for the gene knockout fitness effect (BAGEL
                fitness score), the significance of the fitness effect (MAGeCK p-value), whether the gene is highly
                expressed or mutated, and whether it is belongs to a pathway that is statistically enriched overall
                for fitness genes. These factors are equally weighted components and when combined represent
                70% of the total score by default.
              </li>
            </ol>
          </p>
        </div>

        <div className='section'>
          <h2 id="experimental">Experimental methods</h2>

          <p className='paragraph'>
            <span className='strong'>Citation</span>: For detailed information on Project Score methods please refer
            to its <a target='_blank' href='https://www.nature.com/articles/s41586-019-1103-9' rel='noopener noreferrer'>publication</a>
          </p>

          <p className='paragraph'>
            <span className='strong'>Cancer Cell Models</span>: Cell models used in Project Score are part of the <a
            target='_blank' rel='noopener noreferrer' href='https://www.ncbi.nlm.nih.gov/pubmed/30260411'>Cell Model
            Passports</a> collection of highly genomically-annotated cell lines, broadly represent the molecular
            features of
            patient tumours, and include common cancers (lung, colon, breast) and cancers of particular unmet clinical
            need (lung and pancreas).
          </p>

          <p>
            All cell models are mycoplasma free and are genetically verified and cross referenced using STR and SNP
            profiling.
          </p>


          <p className='paragraph'>
            <span className='strong'>Genome-scale CRISPR screens</span>: The CRISPR library used for screens
            (<a target='_blank' rel='noopener noreferrer' href='https://www.ncbi.nlm.nih.gov/pubmed/27760321'>Tzelepis
            et al, 2016</a> is available from
            <a target='_blank' rel='noopener noreferrer'
               href='https://www.google.com/url?q=https://www.addgene.org/pooled-library/yusa-crispr-knockout-human-v1/&sa=D&ust=1554318914147000&usg=AFQjCNEjKSvjfi8Ds_ytF3l4aTUWqOZ6hA'> Addgene,
              Cat no. 67989</a>)
            contains 90,709 sgRNAs targeting 18,009 genes (~5 sgRNAs/gene). All pooled screens were completed in
            technical
            triplicate at 100x coverage of the library (i.e. ~100 cells per sgRNA were transduced).
            Stringent quality control are applied at all stages of the experiment pipeline,
            including:
          </p>

          <ul>
            <li>
              every screened cell line has &gt;75% Cas9 activity;
            </li>
            <li>
              every cell line is transduced with the library at >15% efficiency;
            </li>
            <li>
              cells are monitored for changes in morphology or growth rates following lentiviral transduction;
            </li>
            <li>
              a DNA yield of >72ug is required to maintain library coverage;
            </li>
            <li>
              quality and size of all PCR products are checked.
            </li>
          </ul>

          <p>
            Further rigorous quality control assessment of the data are also completed (described in detail in
            accompanying
            manuscript). Only data satisfying all quality control measures are included in this webportal.
          </p>

          <p className='paragraph'>
            <span className='strong'>Defining fitness genes</span>: Gene independent responses (e.g. copy number) to
            CRISPR-Cas9 are corrected
            using <a target='_blank' rel='noopener noreferrer'
                     href='https://www.ncbi.nlm.nih.gov/pubmed/30103702'>CRISPRcleanR</a>.
            Loss of fitness scores are generated from corrected FCs through an in-house R implementation of the <a
            target='_blank' rel='noopener noreferrer' href='https://www.ncbi.nlm.nih.gov/pubmed/27083490'>BAGEL
            method</a> to call significantly depleted genes (code publicly available at <a target='_blank'
                                                                                           rel='noopener noreferrer'
                                                                                           href='https://github.com/francescojm/BAGELR'>https://github.com/francescojm/BAGELR</a>).
            Our BAGEL implementation computes gene-level Bayesian factors (BFs) by calculating the average of the sgRNAs
            on a targeted-gene basis,
            instead of summing them. Additionally, it uses reference sets of predefined essential and non-essential
            genes <a target='_blank' rel='noopener noreferrer' href='https://www.ncbi.nlm.nih.gov/pubmed/27397505'>further
            curated to exclude high-confidence cancer driver genes</a>.
            A statistical significance threshold for gene-level BFs is determined for each cell line.
            Each gene is assigned a scaled BF computed by subtracting the BF at the 5% FDR threshold
            (obtained from classifying reference essential/non-essential genes based on BF rankings)
            defined for each cell line from the original BF. For consistency of visualisation, all scaled BF values are
            multiplied by -1 resulting in significantly depleted values
            having a loss of fitness score &lt; 0.
          </p>

          <div className='paragraph'>
            <p>
              <span className='strong'>Gene fitness metrics used</span>:
            </p>
            <p className='indented'>
              <span className='outlined'>Fitness Score</span>: based on scaled BF from BAGEL. A score
              &lt; 0 indicates a statistically significant effect on cell fitness.
            </p>

            <p className='indented'>
              <span className='outlined'>Corrected fold change</span>: Copy-number-bias corrected gene depletion fold
              change, computed between
              average representation of targeting sgRNAs 14 days post-transfection versus plasmid library
            </p>
          </div>


          <p className='paragraph'>
            <span className='strong'>Core fitness genes</span>: Fitness genes common to the majority of cell lines
            tested, or common within a
            cancer
            type, may be involved in cell essential processes - we refer to these as core fitness genes. In order to
            identify core fitness genes, we developed a statistical method, ADaM (Adaptive Daisy Model) which adaptively
            determines the minimum number of dependent cell models required for a gene to be classified as a core
            fitness
            gene. ADaM was implemented at both a cancer-type specific level and a pan-cancer specific level (code
            publicly available at <a target='_blank' rel='noopener noreferrer'
                                     href='https://github.com/francescojm/ADAM'>https://github.com/francescojm/ADAM</a>).
          </p>
        </div>

        <div className='section'>
          <h2 id="glossary">
            Glossary of terms
          </h2>

          <div className='paragraph'>
            <div className='glossary-header'>Core Fitness Gene</div>

            <div className='glossary-description'>
              Genes which are required for the fitness of the majority of cell lines from a given cancer type or across
              multiple cancer-types.
            </div>
          </div>


          <div className='paragraph'>
            <div className='glossary-header'>Fitness Score</div>
            <div className='glossary-description'>Quantitative measure of the reduction of cell viability elicited by a
              gene inactivation, via CRISPR-Cas9
              targeting. This is based on Bayes Factor value computed using BAGEL starting from CRISPRcleanR corrected
              gene
              depletion fold changes, and scaled to a 5% false discovery rate threshold (from classifying reference
              essential/non-essential genes based on BF rankings)
            </div>
          </div>

          <div className='paragraph'>
            <div className='glossary-header'>Corrected Fold Change</div>
            <div className='glossary-description'>
              CRISPRcleanR corrected gene depletion fold change, computed between average representation of targeting
              sgRNAs 14 days post-transfection versus plasmid library
            </div>
          </div>

          <div className='paragraph'>
            <div className='glossary-header'>BAGEL</div>
            <div className='glossary-description'>
              A supervised learning method for analysing gene knockout screens and inferring gene fitness effects,
              starting
              from the observation of those elicited by two reference sets of essential/non-essential genes. Further
              details can be
              found in the <a target='_blank' rel='noopener noreferrer'
                              href='https://www.ncbi.nlm.nih.gov/pubmed/27083490'>corresponding article</a>.
            </div>
          </div>


          <div className='paragraph'>
            <div className='glossary-header'>CRISPRcleanR</div>
            <div className='glossary-description'>
              An unsupervised method for identifying and correcting gene-independent responses to CRISPR-Cas9
              targeting; based on segmentation of sgRNA fold change values across the genomes. Further details can be
              found in the <a target='_blank' rel='noopener noreferrer'
                              href='https://www.ncbi.nlm.nih.gov/pubmed/30103702'>corresponding article</a>.
            </div>
          </div>

          <div className='paragraph'>
            <div className='glossary-header'>Target Priority Score</div>
            <div className='glossary-description'>
              A quantitative assessment of the potential of each gene as a candidate cancer therapeutic target. It
              is computed by an analytical framework that combines CRISPR knockout gene fitness effects with
              biomarker and patient data to output a target priority score from 0 – 100 (highest to lowest).
            </div>
          </div>

          <div className='paragraph'>
            <div className='glossary-header'>Cell Model Passport</div>
            <div className='glossary-description'>
              The Cell Model Passport describes the cell models used within the Sanger <a target='_blank'
                                                                                          rel='noopener noreferrer'
                                                                                          href='https://depmap.sanger.ac.uk/'>Cancer
              Dependency Map</a>. The site
              brings together effective curation of cancer cell models with genomic and functional data sets to
              facilitate
              access and integration.
            </div>
          </div>

          <div className='paragraph'>
            <div className='glossary-header'>Cancer Dependency Map</div>
            <div className='glossary-description'>
              The cancer dependency map is an international effort by the Sanger Institute in the UK and Broad Institute
              in
              the United States. Researchers aim to bridge the gap that exists between genome sequencing and providing
              precision medicine to the many cancer patients. We aim to exhaustively define genes which are essential
              for
              cancer cell survival - so called dependencies - which might serve as targets for new therapies. Mapping
              these
              dependencies requires bringing together world-leading capabilities in cancer cell model generation, drug
              testing, genetic screens and analytics (https://depmap.sanger.ac.uk/).
            </div>
          </div>
        </div>

        <div className='section'>
          <h2 id="usage">Data Usage Policy</h2>
          <p className='paragraph'>
            Users have a non-exclusive, non-transferable right to use data files for internal proprietary research and
              educational purposes, including target, biomarker and drug discovery. Excluded from this licence are use
              of the data (in whole or any significant part) for resale either alone or in combination with additional
              data/product offerings, or for provision of commercial services. <br />
              Please note: The data files are experimental and academic in nature and are not licensed or certified by
              any regulatory body. Genome Research Limited provides access to data files on an “as is” basis and
              excludes all warranties of any kind (express or implied). If you are interested in incorporating results
              or software into a product, or have questions, please contact depmap@sanger.ac.uk.
          </p>
        </div>
      </Container>
    </Fragment>
  );
}
