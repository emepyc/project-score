import React from 'react';

import {fetchAnalyses} from '../../api';
import GenericFilterSelect from "../GenericFilterSelect";

export default function AnalysisFilter() {
  return (<GenericFilterSelect
    itemType='analysis'
    endpoint={fetchAnalyses}
    itemLabel={'analysis'}
  />);
}
