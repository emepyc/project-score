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
              <NavLink href='#experimental'>
                Experimental methods
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href='#glossary'>
                Glossary of terms
              </NavLink>
            </NavItem>
          </Nav>
        </div>
        <div className='section'>
          <h1>Project Score</h1>
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
            Dependency Map</a>
            at the <a target='_blank' rel='noopener noreferrer' href="https://www.sanger.ac.uk/">Sanger</a>, which aims
            to
            identify all dependencies in every cancer cell.
          </p>

          <p className='paragraph caption'>
            The Project Score database is a part of an ongoing research project and results will be updated and are
            neither
            complete or final.
          </p>
        </div>

        <div className='section'>
          <h2><a name="experimental">Experimental methods</a></h2>

          <p className='paragraph'>
            <span className='strong'>Citation</span>: For detailed information on Project Score methods please refer
            to its <a href=''>publication</a>
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
            method</a>
            to call significantly depleted genes (code publicly available at <a target='_blank'
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
          <h2>
            <a name='glossary'>
              Glossary of terms
            </a>
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
              from the observation of those elicited by two reference sets of essential/non-essential genes. Further details can be
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
      </Container>
    </Fragment>
  );
}
