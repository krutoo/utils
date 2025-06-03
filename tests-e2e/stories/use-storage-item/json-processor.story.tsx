import { useStorageItem, getJsonProcessor } from '@krutoo/utils/react';

export const meta = {
  category: 'React hooks/useStorageItem',
  title: 'With JSON processor',
};

export default function Example() {
  const [clickCount, setClickCount] = useStorageItem('clickCount', {
    storage: localStorage,
    processor: getJsonProcessor(0),
  });

  const handleClick = () => {
    setClickCount(clickCount + 1);
  };

  return (
    <>
      <p>Update page to see the count is saved in localStorage.</p>

      <button className='counter' onClick={handleClick}>
        Clicked {clickCount} times
      </button>
    </>
  );
}
