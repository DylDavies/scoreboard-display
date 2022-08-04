import { app, BrowserWindow, screen, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as fsExtra from 'fs-extra';
import * as url from 'url';
import { IProject } from '../src/app/shared/interfaces/IProject';

let activeProject: string;

const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

let welcomeWindow: BrowserWindow;
let mainWindow: BrowserWindow;
let displayWindow: BrowserWindow;

function createWelcomeWindow(): BrowserWindow {
  // Create the browser window.
  welcomeWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: 1012,
    height: 624,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
      contextIsolation: false,  // false if you want to run e2e test with Spectron
      //devTools: false
    },
    resizable: false,
    autoHideMenuBar: true
  });

  if (serve) {
    const debug = require('electron-debug');
    debug();

    require('electron-reloader')(module);
    welcomeWindow.loadURL('http://localhost:4200/home');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
       // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    welcomeWindow.loadURL(url.format({
      pathname: path.join(__dirname, pathIndex),
      protocol: 'file:',
      slashes: true
    }));
  }

  welcomeWindow.close

  // Emitted when the window is closed.
  welcomeWindow.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    welcomeWindow = null;
  });

  return welcomeWindow;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(createWelcomeWindow, 400));

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (welcomeWindow === null) {
      createWelcomeWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}

// Create main window
function createMainWindow() {
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
      contextIsolation: false,  // false if you want to run e2e test with Spectron
      //devTools: false
    },
    resizable: false,
    autoHideMenuBar: true
  });

  if (serve) {
    const debug = require('electron-debug');
    debug();

    require('electron-reloader')(module);
    mainWindow.loadURL('http://localhost:4200/edit');
  } else {
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
      pathIndex = '../dist/index.html';
    }

    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, pathIndex),
      protocol: 'file:',
      slashes: true
    }));
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  return mainWindow;
}

// Create Display window
function createDisplayWindow() {
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  displayWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
      contextIsolation: false,  // false if you want to run e2e test with Spectron
      //devTools: false
    },
    autoHideMenuBar: true
  });

  if (serve) {
    const debug = require('electron-debug');
    debug();

    require('electron-reloader')(module);
    displayWindow.loadURL('http://localhost:4200/display');
  } else {
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
      pathIndex = '../dist/index.html';
    }

    displayWindow.loadURL(url.format({
      pathname: path.join(__dirname, pathIndex),
      protocol: 'file:',
      slashes: true
    }));
  }

  // Emitted when the window is closed.
  displayWindow.on('closed', () => {
    displayWindow = null;
  });

  return displayWindow;
}

function openProject() {
  createMainWindow();
  welcomeWindow.close();
}

function closeProject() {
  createWelcomeWindow();
  mainWindow.close();
}

ipcMain.handle("GetAllProjects", () => {
  let files = fs.readdirSync(path.join(__dirname, '../data/projects/')).map(f => `${path.join(__dirname, '../data/projects/', f)}/meta.json`);
  let projects = files.map(f => JSON.parse(fs.readFileSync(f, 'utf8')));
  return projects;
})

ipcMain.handle("CreateProject", (_: Event, project: IProject) => {
  let projectPath = getSafeBasePath(project.name);
  fs.mkdirSync(projectPath);
  fs.mkdirSync(projectPath + "/assets");
  fs.writeFileSync(path.join(projectPath, 'meta.json'), JSON.stringify(project));
  activeProject = projectPath;
  openProject();
  return true;
});

ipcMain.handle("OpenProject", (_: Event, project: string) => {
  activeProject = getSafeBasePath(project);
  openProject();
  return true;
});

ipcMain.handle("OpenDisplay", (_: Event) => {
  createDisplayWindow();
  return true;
});

ipcMain.handle("SaveProject", (_: Event, project: IProject) => {
  let newProjectPath = getSafeBasePath(project.name);
  fs.writeFileSync(path.join(activeProject, 'meta.json'), JSON.stringify(project));
  if (activeProject !== newProjectPath) {
    fsExtra.copySync(activeProject, newProjectPath);
    fs.rmSync(activeProject, { recursive: true });
    activeProject = newProjectPath;
  }
  return true;
});

ipcMain.handle("DeleteProject", (_: Event, project: string) => {
  closeProject();
  let projectPath = getSafeBasePath(project);
  fs.rmdirSync(projectPath, { recursive: true });
  return true;
});

ipcMain.handle("CloseProject", (_: Event) => {
  closeProject();
  return true;
});

ipcMain.handle("GetActiveProject", () => {
  return JSON.parse(fs.readFileSync(path.join(activeProject, 'meta.json'), 'utf8'));
});

function getSafeBasePath(name: string) {
  let filename = name.replace(/[^a-z0-9]/gi, "_");
  return path.join(__dirname, '../data/projects/', filename);
}