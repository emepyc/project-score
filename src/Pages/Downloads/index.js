import React, {useState} from 'react';
import {Jumbotron, Table, Tooltip} from 'reactstrap';
import {CSVLink} from 'react-csv';

import FetchData from "../../Components/FetchData";

import './downloads.scss';
import fetchPriorityScores, {formatPriorityScore} from "../../api/fetchPriorityScores";

export default function Downloads() {
  const [rawTooltipOpen, setRawTooltipOpen] = useState(false);
  const [correctedTooltipOpen, setCorrectedTooltipOpen] = useState(false);
  const [scaledTooltipOpen, setScaledTooltipOpen] = useState(false);
  const [priorityScoresTooltipOpen, setPriorityScoresTooltipOpen] = useState(false);

  const toggleRawTooltip = () => setRawTooltipOpen(!rawTooltipOpen);
  const toggleCorrectedTooltip = () => setCorrectedTooltipOpen(!correctedTooltipOpen);
  const toggleScaledTooltip = () => setScaledTooltipOpen(!scaledTooltipOpen);
  const togglePriorityScoresTooltip = () => setPriorityScoresTooltipOpen(!priorityScoresTooltipOpen);

  return (
    <div
      style={{
        marginTop: '20px',
        marginLeft: '40px',
        marginRight: '40px',
        minHeight: '30rem'
      }}
    >
      <div
        className="section"
        style={{borderBottom: '1px solid green', paddingBottom: '20px'}}
      >
        <h2>Downloads</h2>
      </div>
      <Jumbotron>
        <h5>Data Usage Policy:</h5>
        <p>
          Users have a non-exclusive, non-transferable right to use data
          files for internal proprietary research and educational
          purposes, including target, biomarker and drug discovery.
          Excluded from this licence are use of the data (in whole or any
          significant part) for resale either alone or in combination with
          additional data/product offerings, or for provision of
          commercial services.
        </p>
      </Jumbotron>

      <div style={{paddingLeft: '30px', paddingRight: '30px'}}>
        <h3>Priority Scores</h3>
        <Table responsive>
          <thead>
          <tr>
            <th>
              Data release
            </th>
            <th>
              Priority Scores File
              <sup>
                    <span className='tooltipAnchor' id='PriorityScoresFileTooltip'>
                      ?
                    </span>
              </sup>

            </th>
          </tr>
          <tr>
            <td>Current release</td>
            <td>
              <div style={{maxWidth: '200px', minHeight: '25px'}}>
                <FetchData
                  endpoint={fetchPriorityScores}
                  params={{threshold: 0}}
                  deps={[]}
                >
                  {priorityScores => (
                    <CSVLink
                      filename='depmap-priority-scores.csv'
                      data={priorityScores.data.map(formatPriorityScore)}
                    >
                      depmap-priority-scores.csv
                    </CSVLink>
                  )}
                </FetchData>
              </div>
            </td>
          </tr>
          </thead>
        </Table>

        <h3>
          Fitness Scores
        </h3>
        <Table responsive>
          <thead>
          <tr>
            <th>Data release</th>
            <th>
              sgRNA Read Count
              <sup>
                    <span className='tooltipAnchor' id='RawDataFilesTooltip'>
                      ?
                    </span>
              </sup>
            </th>
            <th>
              Copy Number Bias Corrected Fold Change Values
              <sup>
                    <span className='tooltipAnchor' id='CorrectedDataFilesTooltip'>
                      ?
                    </span>
              </sup>
            </th>
            <th>
              Fitness/Non-fitness Binary Matrix
              <sup>
                    <span className='tooltipAnchor' id='ScaledDataFilesTooltip'>
                      ?
                    </span>
              </sup>
            </th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>Release 1 (5th April 2019)</td>
            <td><a
              href="https://cog.sanger.ac.uk/cmp/download/raw_sgrnas_counts.zip">raw_sgrnas_counts.zip</a>
            </td>
            <td><a
              href="https://cog.sanger.ac.uk/cmp/download/essentiality_matrices.zip">essentiality_matrices.zip</a>
            </td>
            <td><a
              href="https://cog.sanger.ac.uk/cmp/download/binaryDepScores.tsv.zip">binaryDepScores.tsv.zip</a>
            </td>
          </tr>
          <tr>
            <td>Broad Institute 19Q2 cell lines<br/><small>processed through Project Score pipeline</small></td>
            <td><a
              href='https://depmap.org/portal/download/'>Available from depmap.org</a>
            </td>
            <td><a
              href='https://cog.sanger.ac.uk/cmp/download/broad_essentiality_matrices_190724.zip'>broad_essentiality_matrices_190724.zip</a>
            </td>
            <td><a
              href='https://cog.sanger.ac.uk/cmp/download/broad_binaryDepScores_190724.tsv.zip'>broad_binaryDepScores_190724.tsv.zip</a>
            </td>
          </tr>
          <tr>
            <td>Integrated cancer dependency dataset from <br/>Wellcome Sanger Institute (release 1) and Broad Institute
              (19Q3)
            </td>
            <td><a
              href='https://depmap.org/portal/download/'>Available from depmap.org</a>
            </td>
            <td><a
              href='https://cog.sanger.ac.uk/cmp/download/integrated_Sanger_Broad_essentiality_matrices_20200402.zip'>integrated_Sanger_Broad_essentiality_matrices_20200402.zip</a>
            </td>
            <td>N/A</td>
          </tr>
          <tr>
            <td>Integrated cancer dependency dataset from <br/>Wellcome Sanger Institute (release 1) and Broad Institute (20Q2) from <a href='https://www.nature.com/articles/s41467-021-21898-7'>Pacini et al</a></td>
            <td>
              <a href='https://depmap.org/portal/download/'>Available from depmap.org</a>
            </td>
            <td>
              <a href='https://cog.sanger.ac.uk/cmp/download/Project_score_combined_Sanger_v1_Broad_20Q2_20210311.zip'>
                Project_score_combined_Sanger_v1_Broad_20Q2_20210311.zip
              </a>
            </td>
            <td>N/A</td>
          </tr>
          </tbody>
        </Table>
        <Tooltip
          placement='right'
          isOpen={priorityScoresTooltipOpen}
          target='PriorityScoresFileTooltip'
          toggle={togglePriorityScoresTooltip}
        >
          Target priority scores are provided based on the default parameters used on the website and as previously
          described (Behan et al., Nature. 2019)
        </Tooltip>

        <Tooltip
          placement='right'
          isOpen={rawTooltipOpen}
          target='RawDataFilesTooltip'
          toggle={toggleRawTooltip}
        >
          Unprocessed sgRNA read count files; each file includes plasmid read counts.
        </Tooltip>
        <Tooltip
          placement='right'
          isOpen={correctedTooltipOpen}
          target='CorrectedDataFilesTooltip'
          toggle={toggleCorrectedTooltip}
        >
          Gene level log fold changes; gene independent bias corrected using CRISPRcleanR default settings.
        </Tooltip>
        <Tooltip
          placement='right'
          isOpen={scaledTooltipOpen}
          target='ScaledDataFilesTooltip'
          toggle={toggleScaledTooltip}
        >
          Binary matrix defining each gene in each cell line as a fitness gene
          or not based on bayes factors values calculated using BAGEL and
          scaled with respect to a 5% false discovery rate threshold.
        </Tooltip>
      </div>
    </div>
  );
}
