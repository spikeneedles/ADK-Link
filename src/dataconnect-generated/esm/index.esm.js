import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'studio',
  location: 'us-east4'
};

export const addLogEntryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddLogEntry', inputVars);
}
addLogEntryRef.operationName = 'AddLogEntry';

export function addLogEntry(dcOrVars, vars) {
  return executeMutation(addLogEntryRef(dcOrVars, vars));
}

export const getNotificationsForUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetNotificationsForUser', inputVars);
}
getNotificationsForUserRef.operationName = 'GetNotificationsForUser';

export function getNotificationsForUser(dcOrVars, vars) {
  return executeQuery(getNotificationsForUserRef(dcOrVars, vars));
}

export const createFileMetadataRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateFileMetadata', inputVars);
}
createFileMetadataRef.operationName = 'CreateFileMetadata';

export function createFileMetadata(dcOrVars, vars) {
  return executeMutation(createFileMetadataRef(dcOrVars, vars));
}

export const getUserSettingsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserSettings', inputVars);
}
getUserSettingsRef.operationName = 'GetUserSettings';

export function getUserSettings(dcOrVars, vars) {
  return executeQuery(getUserSettingsRef(dcOrVars, vars));
}

