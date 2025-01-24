const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    validatePassword: (password) => ipcRenderer.send('validate-password', password),
    onPasswordValidationFailed: (callback) =>
        ipcRenderer.on('password-validation-failed', (_, message) => callback(message)),
    onPasswordValidationError: (callback) =>
        ipcRenderer.on('password-validation-error', (_, message) => callback(message)),
});
