import { useQuery, QueryMangerContext, MemoryQueryManager } from '@krutoo/utils/react';
import { wait, randomInteger } from '@krutoo/utils';

export const meta = {
  category: 'React hooks/useQuery',
  title: 'Lazy loading example',
};

async function getPosts() {
  await wait(320);

  const phrases = [
    'Lorem ipsum dolor sit amet.',
    'Reiciendis unde aperiam natus nobis!',
    'Nihil sunt dolorum delectus perferendis?',
    'Voluptatem iusto non eius deserunt.',
    'Mollitia ipsa beatae nostrum similique.',
  ];

  return Array(10)
    .fill(0)
    .map(() => ({
      id: Math.random().toString(16).slice(2),
      title: phrases[randomInteger(0, phrases.length - 1)] ?? '',
    }));
}

function UserDataView() {
  const posts = useQuery<Array<{ id: string; title: string }>>({
    key: 'posts',
    async query({ prevData }) {
      return [...(prevData ?? []), ...(await getPosts())];
    },
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h1>Example: lazy loading</h1>

      {posts.status === 'pending' && !posts.data && <p>Loading...</p>}

      {posts.status === 'failure' && <p>{String(posts.error)}</p>}

      {posts.data && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {posts.data.map(post => (
            <div key={post.id}>{post.title}</div>
          ))}
        </div>
      )}

      <button disabled={posts.status === 'pending'} onClick={() => posts.invalidate()}>
        {posts.status === 'pending' ? 'Loading...' : 'Load more'}
      </button>
    </div>
  );
}

const queryManager = new MemoryQueryManager();

export default function Example() {
  return (
    <QueryMangerContext value={queryManager}>
      <UserDataView />
    </QueryMangerContext>
  );
}
