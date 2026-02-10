# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useAddLogEntry, useGetNotificationsForUser, useCreateFileMetadata, useGetUserSettings } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useAddLogEntry(addLogEntryVars);

const { data, isPending, isSuccess, isError, error } = useGetNotificationsForUser(getNotificationsForUserVars);

const { data, isPending, isSuccess, isError, error } = useCreateFileMetadata(createFileMetadataVars);

const { data, isPending, isSuccess, isError, error } = useGetUserSettings(getUserSettingsVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { addLogEntry, getNotificationsForUser, createFileMetadata, getUserSettings } from '@dataconnect/generated';


// Operation AddLogEntry:  For variables, look at type AddLogEntryVars in ../index.d.ts
const { data } = await AddLogEntry(dataConnect, addLogEntryVars);

// Operation GetNotificationsForUser:  For variables, look at type GetNotificationsForUserVars in ../index.d.ts
const { data } = await GetNotificationsForUser(dataConnect, getNotificationsForUserVars);

// Operation CreateFileMetadata:  For variables, look at type CreateFileMetadataVars in ../index.d.ts
const { data } = await CreateFileMetadata(dataConnect, createFileMetadataVars);

// Operation GetUserSettings:  For variables, look at type GetUserSettingsVars in ../index.d.ts
const { data } = await GetUserSettings(dataConnect, getUserSettingsVars);


```