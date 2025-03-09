import { debounce } from '@krutoo/utils';
import { useMemo, useState } from 'react';

export const meta = {
  category: 'Misc/debounce',
  title: 'Primary example',
};

export default function Example() {
  const [value, setValue] = useState('');
  const [query, setQuery] = useState('');

  const handleChange = useMemo(() => {
    const updateQuery = debounce(setQuery, 320);

    return (event: { target: { value: string } }) => {
      setValue(event.target.value);
      updateQuery(event.target.value);
    };
  }, []);

  return (
    <>
      <input type='text' value={value} onChange={handleChange} />
      <p>Input value: {value}</p>
      <p>Search query: {query}</p>
    </>
  );
}
