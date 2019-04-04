import {useState} from 'react';
import debounce from 'lodash.debounce';

const deferred = (fn) => debounce(fn, 2000);

export default function useDeferred(initialValue) {
  const [value, setValue] = useState(initialValue);
  return [value, deferred(setValue)];
}
