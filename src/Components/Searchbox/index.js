import React, {useState} from 'react';
import AsyncSelect from 'react-select/lib/Async';
import debounce from 'debounce-promise';
import {withRouter} from 'react-router-dom';

import Spinner from '../Spinner';
import {search} from '../../api';
import {colorInsignificantBg, insignificantNodeColor} from "../../colors";

const groupStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const _groupBadgeStyles = {
  borderRadius: '2em',
  display: 'inline-block',
  fontSize: 12,
  fontWeight: 'normal',
  lineHeight: 1,
  minWidth: 1,
  padding: '0.16666666666667em 0.5em',
  textAlign: 'center',
  marginLeft: '10px',
};

const _colorsGroupBageStyles = {
  backgroundColor: '#EBECF0',
  color: '#172B4D',
};

const _colorsGroupBadgesDisabledStyles = {
  backgroundColor: '#FAFAFA',
  color: insignificantNodeColor,
};

const groupBadgeStyles = {
  ..._groupBadgeStyles,
  ..._colorsGroupBageStyles,
};

const groupBadgeStylesDisabled = {
  ..._groupBadgeStyles,
  ..._colorsGroupBadgesDisabledStyles,
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
  .then(callback);

const loadSuggestions = debounce(_loadSuggestions, 500, {leading: true});

function Searchbox({placeholder = "Search for a gene, cell line or tissue", history}) {
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
      history.push(`/table?tissue=${value.id}`);
    }
  };

  const formatGroupLabel = data => (
    <div style={groupStyles}>
      <span>{data.label}</span>
      <span style={groupBadgeStyles}>{data.options.length}</span>
    </div>
  );

  const formatOptionLabel = option => {
    const tissueStyles = isOptionDisabled(option) ?
      groupBadgeStylesDisabled :
      groupBadgeStyles;

    return (
      <React.Fragment>
        <span>{option.label}</span>
        <div className="float-right">
          {isOptionDisabled(option) && (
            <span>({option.status})</span>
          )}
          {option.tissue && (
            <span style={tissueStyles}>{option.tissue}</span>
          )}
        </div>
      </React.Fragment>
    );
  };

  const onInputChange = value => setInputValue(value);

  const isOptionDisabled = option => option.status !== "available";

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
      isOptionDisabled={isOptionDisabled}
    >
    </AsyncSelect>
  );
}

export default withRouter(Searchbox);
