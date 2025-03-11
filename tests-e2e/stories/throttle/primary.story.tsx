import { useCallback, useMemo, useState } from 'react';
import { throttle } from '@krutoo/utils';
import { format } from 'date-fns/format';

export const meta = {
  category: 'Misc/throttle',
  title: 'Primary example',
};

export default function Example() {
  const [messages, setMessages] = useState<string[]>([]);

  const addMessage = useCallback(() => {
    const newMessage = `Clicked at ${format(new Date(), 'HH:mm:ss')}`;

    setMessages(list => [...list, newMessage]);
  }, []);

  const handleClick = useMemo(() => throttle(addMessage, 1000), [addMessage]);

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
