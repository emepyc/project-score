import React, {useCallback, useState} from 'react';
import AsyncSelect from 'react-select/lib/Async';
import debounce from 'lodash.debounce';

import {search} from '../../api';

const groupStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
};
const groupBadgeStyles = {
    backgroundColor: "#EBECF0",
    borderRadius: "2em",
    color: "#172B4D",
    display: "inline-block",
    fontSize: 12,
    fontWeight: "normal",
    lineHeight: "1",
    minWidth: 1,
    padding: "0.16666666666667em 0.5em",
    textAlign: "center",
};

function Searchbox() {
  const [inputValue, setInputValue] = useState("");

  const onInputChange = useCallback(newValue => {
    setInputValue(newValue);
  }, [inputValue]);

  const _loadSuggestions = (inputValue, callback) => search(inputValue)
    .then(resp => callback(resp));

  const loadSuggestions = debounce(_loadSuggestions, 500);

  const onChange = value => {
    console.log('value here...');
    console.log(value);
  };

  const formatGroupLabel = data => (
    <div style={groupStyles}>
      <span>{data.title}</span>
      <span style={groupBadgeStyles}>{data.options.length}</span>
    </div>
  );

  const formatOptionLabel = option => (
    <div style={groupStyles}>
      <span>{option.label}</span>
      <span style={groupBadgeStyles}>{option.tissue}</span>
    </div>
  );

  return (
    <AsyncSelect
      loadOptions={loadSuggestions}
      onInputChange={onInputChange}
      placeholder="Search for a gene, cell line or tissue"
      onChange={onChange}
      isClearable
      formatOptionLabel={formatOptionLabel}
      formatGroupLabel={formatGroupLabel}
    >
    </AsyncSelect>
  );
}

export default Searchbox;
