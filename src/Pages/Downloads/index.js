import React from 'react';
import { Table, Tooltip } from 'reactstrap';

import './downloads.scss';

class Downloads extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      RawTooltipOpen: false,
      CorrectedTooltipOpen: false,
      ScaledTooltipOpen: false
    };
  }

  toggle(tooltipId) {
    this.setState({
      [tooltipId]: !this.state[tooltipId]
    });
  }

  render() {
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
          style={{ borderBottom: '1px solid green', paddingBottom: '20px' }}
        >
          <h2>Downloads</h2>
        </div>
        <div style={{ paddingLeft: '30px', paddingRight: '30px' }}>
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
                <td>Release 1 (19th July 2018)</td>
                <td><a href="https://cog.sanger.ac.uk/cmp/download/raw_sgrnas_counts.zip">raw_sgrnas_counts.zip</a></td>
                <td><a href="https://cog.sanger.ac.uk/cmp/download/essentiality_matrices.zip">essentiality_matrices.zip</a></td>
                <td><a href="https://cog.sanger.ac.uk/cmp/download/binaryDepScores.tsv.zip">binaryDepScores.tsv.zip</a></td>
              </tr>
            </tbody>
          </Table>
          <Tooltip
            placement='right'
            isOpen={this.state.RawTooltipOpen}
            target='RawDataFilesTooltip'
            toggle={() => this.toggle('RawTooltipOpen')}
          >
            Unprocessed sgRNA read count files; each file includes plasmid read
            counts.
          </Tooltip>
          <Tooltip
            placement='right'
            isOpen={this.state.CorrectedTooltipOpen}
            target='CorrectedDataFilesTooltip'
            toggle={() => this.toggle('CorrectedTooltipOpen')}
          >
            Gene level log fold changes; gene independent bias corrected using
            CRISPRcleanR default settings.
          </Tooltip>
          <Tooltip
            placement='right'
            isOpen={this.state.ScaledTooltipOpen}
            target='ScaledDataFilesTooltip'
            toggle={() => this.toggle('ScaledTooltipOpen')}
          >
            Binary matrix defining each gene in each cell line as a fitness gene
            or not based on bayes factors values calculated using BAGEL and
            scaled with respect to a 5% false discovery rate threshold.
          </Tooltip>
        </div>
      </div>
    );
  }
}

export default Downloads
