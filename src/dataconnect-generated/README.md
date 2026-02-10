# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetNotificationsForUser*](#getnotificationsforuser)
  - [*GetUserSettings*](#getusersettings)
- [**Mutations**](#mutations)
  - [*AddLogEntry*](#addlogentry)
  - [*CreateFileMetadata*](#createfilemetadata)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetNotificationsForUser
You can execute the `GetNotificationsForUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getNotificationsForUser(vars: GetNotificationsForUserVariables): QueryPromise<GetNotificationsForUserData, GetNotificationsForUserVariables>;

interface GetNotificationsForUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetNotificationsForUserVariables): QueryRef<GetNotificationsForUserData, GetNotificationsForUserVariables>;
}
export const getNotificationsForUserRef: GetNotificationsForUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getNotificationsForUser(dc: DataConnect, vars: GetNotificationsForUserVariables): QueryPromise<GetNotificationsForUserData, GetNotificationsForUserVariables>;

interface GetNotificationsForUserRef {
  ...
  (dc: DataConnect, vars: GetNotificationsForUserVariables): QueryRef<GetNotificationsForUserData, GetNotificationsForUserVariables>;
}
export const getNotificationsForUserRef: GetNotificationsForUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getNotificationsForUserRef:
```typescript
const name = getNotificationsForUserRef.operationName;
console.log(name);
```

### Variables
The `GetNotificationsForUser` query requires an argument of type `GetNotificationsForUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetNotificationsForUserVariables {
  userIdId: UUIDString;
}
```
### Return Type
Recall that executing the `GetNotificationsForUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetNotificationsForUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetNotificationsForUserData {
  notifications: ({
    id: UUIDString;
    message: string;
    title?: string | null;
    data?: string | null;
    createdAt: TimestampString;
    readAt?: TimestampString | null;
  } & Notification_Key)[];
}
```
### Using `GetNotificationsForUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getNotificationsForUser, GetNotificationsForUserVariables } from '@dataconnect/generated';

// The `GetNotificationsForUser` query requires an argument of type `GetNotificationsForUserVariables`:
const getNotificationsForUserVars: GetNotificationsForUserVariables = {
  userIdId: ..., 
};

// Call the `getNotificationsForUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getNotificationsForUser(getNotificationsForUserVars);
// Variables can be defined inline as well.
const { data } = await getNotificationsForUser({ userIdId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getNotificationsForUser(dataConnect, getNotificationsForUserVars);

console.log(data.notifications);

// Or, you can use the `Promise` API.
getNotificationsForUser(getNotificationsForUserVars).then((response) => {
  const data = response.data;
  console.log(data.notifications);
});
```

### Using `GetNotificationsForUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getNotificationsForUserRef, GetNotificationsForUserVariables } from '@dataconnect/generated';

// The `GetNotificationsForUser` query requires an argument of type `GetNotificationsForUserVariables`:
const getNotificationsForUserVars: GetNotificationsForUserVariables = {
  userIdId: ..., 
};

// Call the `getNotificationsForUserRef()` function to get a reference to the query.
const ref = getNotificationsForUserRef(getNotificationsForUserVars);
// Variables can be defined inline as well.
const ref = getNotificationsForUserRef({ userIdId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getNotificationsForUserRef(dataConnect, getNotificationsForUserVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.notifications);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.notifications);
});
```

## GetUserSettings
You can execute the `GetUserSettings` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUserSettings(vars: GetUserSettingsVariables): QueryPromise<GetUserSettingsData, GetUserSettingsVariables>;

interface GetUserSettingsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserSettingsVariables): QueryRef<GetUserSettingsData, GetUserSettingsVariables>;
}
export const getUserSettingsRef: GetUserSettingsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserSettings(dc: DataConnect, vars: GetUserSettingsVariables): QueryPromise<GetUserSettingsData, GetUserSettingsVariables>;

interface GetUserSettingsRef {
  ...
  (dc: DataConnect, vars: GetUserSettingsVariables): QueryRef<GetUserSettingsData, GetUserSettingsVariables>;
}
export const getUserSettingsRef: GetUserSettingsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserSettingsRef:
```typescript
const name = getUserSettingsRef.operationName;
console.log(name);
```

### Variables
The `GetUserSettings` query requires an argument of type `GetUserSettingsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserSettingsVariables {
  userIdId: UUIDString;
}
```
### Return Type
Recall that executing the `GetUserSettings` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserSettingsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserSettingsData {
  settings: ({
    key: string;
    value: string;
  })[];
}
```
### Using `GetUserSettings`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserSettings, GetUserSettingsVariables } from '@dataconnect/generated';

// The `GetUserSettings` query requires an argument of type `GetUserSettingsVariables`:
const getUserSettingsVars: GetUserSettingsVariables = {
  userIdId: ..., 
};

// Call the `getUserSettings()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserSettings(getUserSettingsVars);
// Variables can be defined inline as well.
const { data } = await getUserSettings({ userIdId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserSettings(dataConnect, getUserSettingsVars);

console.log(data.settings);

// Or, you can use the `Promise` API.
getUserSettings(getUserSettingsVars).then((response) => {
  const data = response.data;
  console.log(data.settings);
});
```

### Using `GetUserSettings`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserSettingsRef, GetUserSettingsVariables } from '@dataconnect/generated';

// The `GetUserSettings` query requires an argument of type `GetUserSettingsVariables`:
const getUserSettingsVars: GetUserSettingsVariables = {
  userIdId: ..., 
};

// Call the `getUserSettingsRef()` function to get a reference to the query.
const ref = getUserSettingsRef(getUserSettingsVars);
// Variables can be defined inline as well.
const ref = getUserSettingsRef({ userIdId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserSettingsRef(dataConnect, getUserSettingsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.settings);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.settings);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## AddLogEntry
You can execute the `AddLogEntry` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addLogEntry(vars: AddLogEntryVariables): MutationPromise<AddLogEntryData, AddLogEntryVariables>;

interface AddLogEntryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddLogEntryVariables): MutationRef<AddLogEntryData, AddLogEntryVariables>;
}
export const addLogEntryRef: AddLogEntryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addLogEntry(dc: DataConnect, vars: AddLogEntryVariables): MutationPromise<AddLogEntryData, AddLogEntryVariables>;

interface AddLogEntryRef {
  ...
  (dc: DataConnect, vars: AddLogEntryVariables): MutationRef<AddLogEntryData, AddLogEntryVariables>;
}
export const addLogEntryRef: AddLogEntryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addLogEntryRef:
```typescript
const name = addLogEntryRef.operationName;
console.log(name);
```

### Variables
The `AddLogEntry` mutation requires an argument of type `AddLogEntryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddLogEntryVariables {
  userIdId: UUIDString;
  context?: string | null;
  level: string;
  message: string;
  source?: string | null;
  timestamp: TimestampString;
}
```
### Return Type
Recall that executing the `AddLogEntry` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddLogEntryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddLogEntryData {
  logEntry_insert: LogEntry_Key;
}
```
### Using `AddLogEntry`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addLogEntry, AddLogEntryVariables } from '@dataconnect/generated';

// The `AddLogEntry` mutation requires an argument of type `AddLogEntryVariables`:
const addLogEntryVars: AddLogEntryVariables = {
  userIdId: ..., 
  context: ..., // optional
  level: ..., 
  message: ..., 
  source: ..., // optional
  timestamp: ..., 
};

// Call the `addLogEntry()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addLogEntry(addLogEntryVars);
// Variables can be defined inline as well.
const { data } = await addLogEntry({ userIdId: ..., context: ..., level: ..., message: ..., source: ..., timestamp: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addLogEntry(dataConnect, addLogEntryVars);

console.log(data.logEntry_insert);

// Or, you can use the `Promise` API.
addLogEntry(addLogEntryVars).then((response) => {
  const data = response.data;
  console.log(data.logEntry_insert);
});
```

### Using `AddLogEntry`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addLogEntryRef, AddLogEntryVariables } from '@dataconnect/generated';

// The `AddLogEntry` mutation requires an argument of type `AddLogEntryVariables`:
const addLogEntryVars: AddLogEntryVariables = {
  userIdId: ..., 
  context: ..., // optional
  level: ..., 
  message: ..., 
  source: ..., // optional
  timestamp: ..., 
};

// Call the `addLogEntryRef()` function to get a reference to the mutation.
const ref = addLogEntryRef(addLogEntryVars);
// Variables can be defined inline as well.
const ref = addLogEntryRef({ userIdId: ..., context: ..., level: ..., message: ..., source: ..., timestamp: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addLogEntryRef(dataConnect, addLogEntryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.logEntry_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.logEntry_insert);
});
```

## CreateFileMetadata
You can execute the `CreateFileMetadata` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createFileMetadata(vars: CreateFileMetadataVariables): MutationPromise<CreateFileMetadataData, CreateFileMetadataVariables>;

interface CreateFileMetadataRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateFileMetadataVariables): MutationRef<CreateFileMetadataData, CreateFileMetadataVariables>;
}
export const createFileMetadataRef: CreateFileMetadataRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createFileMetadata(dc: DataConnect, vars: CreateFileMetadataVariables): MutationPromise<CreateFileMetadataData, CreateFileMetadataVariables>;

interface CreateFileMetadataRef {
  ...
  (dc: DataConnect, vars: CreateFileMetadataVariables): MutationRef<CreateFileMetadataData, CreateFileMetadataVariables>;
}
export const createFileMetadataRef: CreateFileMetadataRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createFileMetadataRef:
```typescript
const name = createFileMetadataRef.operationName;
console.log(name);
```

### Variables
The `CreateFileMetadata` mutation requires an argument of type `CreateFileMetadataVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateFileMetadataVariables {
  uploadedByUserIdId: UUIDString;
  contentType: string;
  fileName: string;
  fileSize: Int64String;
  storagePath: string;
}
```
### Return Type
Recall that executing the `CreateFileMetadata` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateFileMetadataData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateFileMetadataData {
  fileMetadata_insert: FileMetadata_Key;
}
```
### Using `CreateFileMetadata`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createFileMetadata, CreateFileMetadataVariables } from '@dataconnect/generated';

// The `CreateFileMetadata` mutation requires an argument of type `CreateFileMetadataVariables`:
const createFileMetadataVars: CreateFileMetadataVariables = {
  uploadedByUserIdId: ..., 
  contentType: ..., 
  fileName: ..., 
  fileSize: ..., 
  storagePath: ..., 
};

// Call the `createFileMetadata()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createFileMetadata(createFileMetadataVars);
// Variables can be defined inline as well.
const { data } = await createFileMetadata({ uploadedByUserIdId: ..., contentType: ..., fileName: ..., fileSize: ..., storagePath: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createFileMetadata(dataConnect, createFileMetadataVars);

console.log(data.fileMetadata_insert);

// Or, you can use the `Promise` API.
createFileMetadata(createFileMetadataVars).then((response) => {
  const data = response.data;
  console.log(data.fileMetadata_insert);
});
```

### Using `CreateFileMetadata`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createFileMetadataRef, CreateFileMetadataVariables } from '@dataconnect/generated';

// The `CreateFileMetadata` mutation requires an argument of type `CreateFileMetadataVariables`:
const createFileMetadataVars: CreateFileMetadataVariables = {
  uploadedByUserIdId: ..., 
  contentType: ..., 
  fileName: ..., 
  fileSize: ..., 
  storagePath: ..., 
};

// Call the `createFileMetadataRef()` function to get a reference to the mutation.
const ref = createFileMetadataRef(createFileMetadataVars);
// Variables can be defined inline as well.
const ref = createFileMetadataRef({ uploadedByUserIdId: ..., contentType: ..., fileName: ..., fileSize: ..., storagePath: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createFileMetadataRef(dataConnect, createFileMetadataVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.fileMetadata_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.fileMetadata_insert);
});
```

