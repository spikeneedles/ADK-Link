import { AddLogEntryData, AddLogEntryVariables, GetNotificationsForUserData, GetNotificationsForUserVariables, CreateFileMetadataData, CreateFileMetadataVariables, GetUserSettingsData, GetUserSettingsVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useAddLogEntry(options?: useDataConnectMutationOptions<AddLogEntryData, FirebaseError, AddLogEntryVariables>): UseDataConnectMutationResult<AddLogEntryData, AddLogEntryVariables>;
export function useAddLogEntry(dc: DataConnect, options?: useDataConnectMutationOptions<AddLogEntryData, FirebaseError, AddLogEntryVariables>): UseDataConnectMutationResult<AddLogEntryData, AddLogEntryVariables>;

export function useGetNotificationsForUser(vars: GetNotificationsForUserVariables, options?: useDataConnectQueryOptions<GetNotificationsForUserData>): UseDataConnectQueryResult<GetNotificationsForUserData, GetNotificationsForUserVariables>;
export function useGetNotificationsForUser(dc: DataConnect, vars: GetNotificationsForUserVariables, options?: useDataConnectQueryOptions<GetNotificationsForUserData>): UseDataConnectQueryResult<GetNotificationsForUserData, GetNotificationsForUserVariables>;

export function useCreateFileMetadata(options?: useDataConnectMutationOptions<CreateFileMetadataData, FirebaseError, CreateFileMetadataVariables>): UseDataConnectMutationResult<CreateFileMetadataData, CreateFileMetadataVariables>;
export function useCreateFileMetadata(dc: DataConnect, options?: useDataConnectMutationOptions<CreateFileMetadataData, FirebaseError, CreateFileMetadataVariables>): UseDataConnectMutationResult<CreateFileMetadataData, CreateFileMetadataVariables>;

export function useGetUserSettings(vars: GetUserSettingsVariables, options?: useDataConnectQueryOptions<GetUserSettingsData>): UseDataConnectQueryResult<GetUserSettingsData, GetUserSettingsVariables>;
export function useGetUserSettings(dc: DataConnect, vars: GetUserSettingsVariables, options?: useDataConnectQueryOptions<GetUserSettingsData>): UseDataConnectQueryResult<GetUserSettingsData, GetUserSettingsVariables>;
