import { useCallback, useMemo, useState } from 'react';
import { throttle } from '@krutoo/utils';

export const meta = {
  category: 'Misc/throttle',
  title: 'Primary example',
};

export default function Example() {
  const [messages, setMessages] = useState<string[]>([]);

  const addMessage = useCallback(() => {
    setMessages(list => [...list, `Message #${list.length}`]);
  }, []);

  const handleClick = useMemo(() => throttle(addMessage, 500), [addMessage]);

  return (
    <>
      <button onClick={handleClick}>Click me</button>

      <div>
        {messages.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
    </>
  );
}
