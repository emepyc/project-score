import React, {useState} from 'react';
import Select from 'react-select';
import {withRouter} from 'react-router';

import useUrlParams from "../useUrlParams";
import FetchData from "../FetchData";

function GenericFilterSelect(props) {
  const {itemType, endpoint, itemLabel} = props;
  const [selectedItem, setSelectedItem] = useState(null);
  const [urlParams, setUrlParams] = useUrlParams(props);

  const itemFromUrl = urlParams[itemType];

  const onInputChange = item => {
    setSelectedItem(item.id);
  }

  const onChange = value => setUrlParams({
    [itemType]: value ? value.id : "",
  });

  const getOptionLabel = option => option.name;
  const getOptionValue = option => option.id;

  return (
    <FetchData
      endpoint={endpoint}
      params={[]}
      deps={[]}
    >
      {items => {
        const defaultItem = itemFromUrl ?
          items.filter(
            item => itemFromUrl === `${item.id}`
          )[0] : null;

        return (
          <Select
            // TODO: I think this always come from URL (ie, the second part is never evaluated)
            value={defaultItem || selectedItem}
            options={items}
            onChange={onChange}
            placeholder={`Select ${itemLabel}`} // This could be different!
            isClearable
            getOptionValue={getOptionValue}
            getOptionLabel={getOptionLabel}
            onInputChange={onInputChange}
          />
        );
      }}
    </FetchData>
  );
}

export default withRouter(GenericFilterSelect);
