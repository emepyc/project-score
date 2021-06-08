import React from 'react';

import {fetchCancerTypes} from "../../api";
import GenericFilterSelect from "../GenericFilterSelect";

export default function CancerTypeFilter() {
  return (<GenericFilterSelect
    itemType={'cancerType'}
    endpoint={fetchCancerTypes}
  />);
}
