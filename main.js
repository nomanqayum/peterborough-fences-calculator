const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

// Hardcoded password
const hardcodedPassword = "Ebay1212";

app.on('ready', () => {
    console.log("Electron app is ready."); // Log to confirm app launch

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // Ensure context isolation is disabled for IPC
        },
        icon: path.join(__dirname, 'assets', 'logo.png'), // Optional icon
    });

    // Load the password.html as the initial screen
    console.log("Loading password.html interface."); // Debugging log
    mainWindow.loadFile('password.html');

    mainWindow.on('closed', () => {
        console.log("Main window closed."); // Debugging log
        mainWindow = null;
    });
});

// IPC Event Listener for Password Validation
ipcMain.on('validate-password', (event, inputPassword) => {
    console.log("Received password from interface:", inputPassword); // Debugging log

    if (inputPassword === hardcodedPassword) {
        console.log("Password matched. Loading main application."); // Debugging log
        mainWindow.loadFile('index.html');
    } else {
        console.log("Password mismatch. Not proceeding."); // Debugging log
        event.sender.send('password-validation-failed');
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        console.log("Quitting application."); // Debugging log
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        console.log("Reactivating application."); // Debugging log
        createWindow();
    }
});
