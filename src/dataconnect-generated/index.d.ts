import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddLogEntryData {
  logEntry_insert: LogEntry_Key;
}

export interface AddLogEntryVariables {
  userIdId: UUIDString;
  context?: string | null;
  level: string;
  message: string;
  source?: string | null;
  timestamp: TimestampString;
}

export interface CreateFileMetadataData {
  fileMetadata_insert: FileMetadata_Key;
}

export interface CreateFileMetadataVariables {
  uploadedByUserIdId: UUIDString;
  contentType: string;
  fileName: string;
  fileSize: Int64String;
  storagePath: string;
}

export interface FileMetadata_Key {
  id: UUIDString;
  __typename?: 'FileMetadata_Key';
}

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

export interface GetNotificationsForUserVariables {
  userIdId: UUIDString;
}

export interface GetUserSettingsData {
  settings: ({
    key: string;
    value: string;
  })[];
}

export interface GetUserSettingsVariables {
  userIdId: UUIDString;
}

export interface LogEntry_Key {
  id: UUIDString;
  __typename?: 'LogEntry_Key';
}

export interface Notification_Key {
  id: UUIDString;
  __typename?: 'Notification_Key';
}

export interface Setting_Key {
  id: UUIDString;
  __typename?: 'Setting_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface AddLogEntryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddLogEntryVariables): MutationRef<AddLogEntryData, AddLogEntryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddLogEntryVariables): MutationRef<AddLogEntryData, AddLogEntryVariables>;
  operationName: string;
}
export const addLogEntryRef: AddLogEntryRef;

export function addLogEntry(vars: AddLogEntryVariables): MutationPromise<AddLogEntryData, AddLogEntryVariables>;
export function addLogEntry(dc: DataConnect, vars: AddLogEntryVariables): MutationPromise<AddLogEntryData, AddLogEntryVariables>;

interface GetNotificationsForUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetNotificationsForUserVariables): QueryRef<GetNotificationsForUserData, GetNotificationsForUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetNotificationsForUserVariables): QueryRef<GetNotificationsForUserData, GetNotificationsForUserVariables>;
  operationName: string;
}
export const getNotificationsForUserRef: GetNotificationsForUserRef;

export function getNotificationsForUser(vars: GetNotificationsForUserVariables): QueryPromise<GetNotificationsForUserData, GetNotificationsForUserVariables>;
export function getNotificationsForUser(dc: DataConnect, vars: GetNotificationsForUserVariables): QueryPromise<GetNotificationsForUserData, GetNotificationsForUserVariables>;

interface CreateFileMetadataRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateFileMetadataVariables): MutationRef<CreateFileMetadataData, CreateFileMetadataVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateFileMetadataVariables): MutationRef<CreateFileMetadataData, CreateFileMetadataVariables>;
  operationName: string;
}
export const createFileMetadataRef: CreateFileMetadataRef;

export function createFileMetadata(vars: CreateFileMetadataVariables): MutationPromise<CreateFileMetadataData, CreateFileMetadataVariables>;
export function createFileMetadata(dc: DataConnect, vars: CreateFileMetadataVariables): MutationPromise<CreateFileMetadataData, CreateFileMetadataVariables>;

interface GetUserSettingsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserSettingsVariables): QueryRef<GetUserSettingsData, GetUserSettingsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserSettingsVariables): QueryRef<GetUserSettingsData, GetUserSettingsVariables>;
  operationName: string;
}
export const getUserSettingsRef: GetUserSettingsRef;

export function getUserSettings(vars: GetUserSettingsVariables): QueryPromise<GetUserSettingsData, GetUserSettingsVariables>;
export function getUserSettings(dc: DataConnect, vars: GetUserSettingsVariables): QueryPromise<GetUserSettingsData, GetUserSettingsVariables>;

