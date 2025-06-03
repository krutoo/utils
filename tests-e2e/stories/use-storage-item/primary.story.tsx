import { useStorageItem } from '@krutoo/utils/react';

export const meta = {
  category: 'React hooks/useStorageItem',
  title: 'Primary example',
  menuPriority: 10,
};

export default function Example() {
  const [value, setValue] = useStorageItem('inputValue', {
    storage: localStorage,
  });

  const handleChange = (event: { target: { value: string } }) => {
    setValue(event.target.value);
  };

  return (
    <>
      <p>Fill value and then reload page to see that value is saved</p>

      <input value={value ?? ''} onChange={handleChange} data-marker='input' />
    </>
  );
}
