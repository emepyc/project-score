import React, {useState} from 'react';
import {Button, Input, Label} from 'reactstrap';
import isEqual from 'lodash.isequal';

export default function PriorityScoresSettings({defaultSettings, onSubmit}) {
  const [tractability, setTractability] = useState(defaultSettings.tractability);

  const submit = () => onSubmit(currentSettings());

  const currentSettings = () => ({
    tractability,
  });

  return (
    <React.Fragment>
      <div className="mx-5 my-4">
        <Label>
          <Input
            type='checkbox'
            checked={tractability}
            onChange={() => setTractability(!tractability)}
          />{' '}
          Tractability
        </Label>
      </div>
      <div className="mx-5 my-2">
        <Button
          onClick={() => submit()}
          color={"primary"}
          disabled={isEqual(currentSettings(), defaultSettings)}
        >
          Update
        </Button>
      </div>
    </React.Fragment>
  );
}
