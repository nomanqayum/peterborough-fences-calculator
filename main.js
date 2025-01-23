require('dotenv').config(); // Load environment variables

const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

let mainWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        icon: path.join(__dirname, 'assets', 'logo.png'),
    });

    console.log("Loading password.html interface.");
    mainWindow.loadFile('password.html');

    mainWindow.on('closed', () => {
        console.log("Main window closed.");
        mainWindow = null;
    });

    return mainWindow;
}

// Auto-update configuration and events
function setupAutoUpdater() {
    console.log("Setting up auto-updater.");

    autoUpdater.checkForUpdatesAndNotify();

    autoUpdater.on('checking-for-update', () => {
        console.log('Checking for updates...');
    });

    autoUpdater.on('update-available', (info) => {
        console.log('Update available:', info);
        if (mainWindow) {
            mainWindow.webContents.send('update-available', info);
        }
    });

    autoUpdater.on('update-not-available', (info) => {
        console.log('No update available:', info);
    });

    autoUpdater.on('error', (error) => {
        console.error('Error in auto-updater:', error);
        if (mainWindow) {
            mainWindow.webContents.send('update-error', error.message);
        }
    });

    autoUpdater.on('download-progress', (progress) => {
        console.log(`Download progress: ${progress.percent}%`);
        if (mainWindow) {
            mainWindow.webContents.send('download-progress', progress);
        }
    });

    autoUpdater.on('update-downloaded', () => {
        console.log('Update downloaded. Prompting user to restart.');
        if (mainWindow) {
            mainWindow.webContents.send('update-downloaded');
        }
    });
}

// Application events
app.on('ready', () => {
    console.log("Electron app is ready.");
    createMainWindow();
    setupAutoUpdater();
});

ipcMain.on('validate-password', (event, inputPassword) => {
    const actualPassword = 'Ebay1212';
    if (inputPassword === actualPassword) {
        console.log("Password matched. Loading main application.");
        mainWindow.loadFile('index.html');
    } else {
        console.log("Password mismatch. Not proceeding.");
        event.sender.send('password-validation-failed');
    }
});

ipcMain.on('restart-app', () => {
    console.log("Restarting app to apply updates.");
    autoUpdater.quitAndInstall();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        console.log("Quitting application.");
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        console.log("Reactivating application.");
        createMainWindow();
    }
});
