const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'studio',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const addLogEntryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddLogEntry', inputVars);
}
addLogEntryRef.operationName = 'AddLogEntry';
exports.addLogEntryRef = addLogEntryRef;

exports.addLogEntry = function addLogEntry(dcOrVars, vars) {
  return executeMutation(addLogEntryRef(dcOrVars, vars));
};

const getNotificationsForUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetNotificationsForUser', inputVars);
}
getNotificationsForUserRef.operationName = 'GetNotificationsForUser';
exports.getNotificationsForUserRef = getNotificationsForUserRef;

exports.getNotificationsForUser = function getNotificationsForUser(dcOrVars, vars) {
  return executeQuery(getNotificationsForUserRef(dcOrVars, vars));
};

const createFileMetadataRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateFileMetadata', inputVars);
}
createFileMetadataRef.operationName = 'CreateFileMetadata';
exports.createFileMetadataRef = createFileMetadataRef;

exports.createFileMetadata = function createFileMetadata(dcOrVars, vars) {
  return executeMutation(createFileMetadataRef(dcOrVars, vars));
};

const getUserSettingsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserSettings', inputVars);
}
getUserSettingsRef.operationName = 'GetUserSettings';
exports.getUserSettingsRef = getUserSettingsRef;

exports.getUserSettings = function getUserSettings(dcOrVars, vars) {
  return executeQuery(getUserSettingsRef(dcOrVars, vars));
};
