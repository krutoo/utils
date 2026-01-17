import { useQuery, QueryMangerContext, MemoryQueryManager } from '@krutoo/utils/react';
import { wait } from '@krutoo/utils';

export const meta = {
  category: 'React hooks/useQuery',
  title: 'Primary example',
  menuPriority: 100,
};

async function getProfileData() {
  // here is a fake api method implementation
  // you can use fetch, axios, GraphQL, any data source for useQuery
  await wait(320);

  return { name: 'John', age: 23, sex: 'male' };
}

function UserDataView() {
  const profile = useQuery({
    key: 'profile',
    query: getProfileData,
  });

  const handleRefresh = () => {
    profile.invalidate();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h1>Example: useQuery</h1>

      <div>
        <button disabled={profile.status === 'pending'} onClick={handleRefresh}>
          Refresh
        </button>
      </div>

      {profile.status === 'pending' && !profile.data && <p>Loading...</p>}

      {profile.status === 'failure' && <p>{String(profile.error)}</p>}

      {profile.data && (
        <pre style={{ opacity: profile.status === 'pending' ? 0.5 : undefined }}>
          {JSON.stringify(profile.data, null, 2)}
        </pre>
      )}
    </div>
  );
}

const manager = new MemoryQueryManager();

export default function Example() {
  return (
    <QueryMangerContext value={manager}>
      <UserDataView />
    </QueryMangerContext>
  );
}
