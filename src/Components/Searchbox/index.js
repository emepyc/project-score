import React, {useState} from 'react';
import AsyncSelect from 'react-select/lib/Async';
import debounce from 'debounce-promise';
import {withRouter} from 'react-router-dom';
import Spinner from '../Spinner';
import {search} from '../../api';

const groupStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const groupBadgeStyles = {
  backgroundColor: '#EBECF0',
  borderRadius: '2em',
  color: '#172B4D',
  display: 'inline-block',
  fontSize: 12,
  fontWeight: 'normal',
  lineHeight: 1,
  minWidth: 1,
  padding: '0.16666666666667em 0.5em',
  textAlign: 'center',
};

const LoadingMessage = (props) => {
  return (
    <div content={'Custom Loading Message'}>
      <div {...props.innerProps} style={props.getStyles('loadingMessage', props)}>
        <Spinner
          loading={true}
          size={10}
        >
          {props.children}
        </Spinner>
      </div>
    </div>
  );
};

const _loadSuggestions = (inputValue, callback) => search(inputValue)
  .then(resp => callback(resp));

const loadSuggestions = debounce(_loadSuggestions, 500, {leading: true});

function Searchbox({placeholder="Search for a gene, cell line or cancer type", history}) {
  const [inputValue, setInputValue] = useState("");

  const onChange = value => {
    if (!value) {
      return;
    }
    if (value.type === 'genes') {
      history.push(`/gene/${value.id}`);
    } else if (value.type === 'models') {
      history.push(`/model/${value.id}?scoreMax=0`);
    } else {
      // TODO: Remove default cancer types when they are available through the api
      history.push(`/table?analysis=${value.id || 1}`);
    }
  };

  const formatGroupLabel = data => (
    <div style={groupStyles}>
      <span>{data.label}</span>
      <span style={groupBadgeStyles}>{data.options.length}</span>
    </div>
  );

  const formatOptionLabel = option => (
    <div style={groupStyles}>
      <span>{option.label}</span>
      {option.tissue && (
        <span style={groupBadgeStyles}>{option.tissue}</span>
      )}
    </div>
  );

  const onInputChange = value => setInputValue(value);

  return (
    <AsyncSelect
      value={inputValue}
      loadOptions={loadSuggestions}
      placeholder={placeholder}
      onChange={onChange}
      isClearable
      formatOptionLabel={formatOptionLabel}
      formatGroupLabel={formatGroupLabel}
      components={{LoadingMessage}}
      onInputChange={onInputChange}
    >
    </AsyncSelect>
  );
}

export default withRouter(Searchbox);
