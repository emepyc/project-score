import React, {useState} from 'react';
import AsyncSelect from 'react-select/lib/Async';
import debounce from 'debounce-promise';
import {withRouter} from 'react-router-dom';

import Spinner from '../Spinner';
import {search} from '../../api';
import {insignificantNodeColor} from "../../colors";
import Error from '../Error';
import FetchData from "../FetchData";
import {fetchCancerTypes} from "../../api";

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

const _loadSuggestions = (inputValue, callback, allCancerTypes) => search(inputValue, allCancerTypes)
  .then(callback)
  .catch(() => {
    callback([{
      options: [{
        value: 'error',
        label: 'Error loading data',
        disabled: true,
        error: true,
      }]
    }])
  });

const loadSuggestions = debounce(_loadSuggestions, 500, {leading: true});

function Searchbox({placeholder = "Search for a gene, cell line or cancer type", history}) {
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
      history.push(`/table?cancerType=${value.id}`);
    }
  };

  const formatGroupLabel = data => {
    if (data.options[0].error) {
      return null;
    }
    return (
      <div style={groupStyles}>
        <span>{data.label}</span>
        <span style={groupBadgeStyles}>{data.options.length}</span>
      </div>
    );
  };

  const formatOptionLabel = option => {
    if (option.error) {
      return (
        <Error message={option.label}/>
      );
    }

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
    <FetchData
      endpoint={fetchCancerTypes}
      params={{}}
      deps={[]}
    >
      {allCancerTypes => (
        <AsyncSelect
          value={inputValue}
          loadOptions={(query, callback) => loadSuggestions(query, callback, allCancerTypes)}
          placeholder={placeholder}
          onChange={onChange}
          isClearable
          formatOptionLabel={formatOptionLabel}
          formatGroupLabel={formatGroupLabel}
          components={{LoadingMessage}}
          onInputChange={onInputChange}
          isOptionDisabled={isOptionDisabled}
        />
      )}
    </FetchData>
  );
}

export default withRouter(Searchbox);
