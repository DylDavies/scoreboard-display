import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IEvent } from '../../../shared/interfaces/IEvent';
import { IProject } from '../../../shared/interfaces/IProject';
import { IScene } from '../../../shared/interfaces/IScene';
import { ElectronService } from '../electron/electron.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ProjectManagerService {

  private activeProject: IProject = null;
  private _activeProjectSrc = new BehaviorSubject<IProject>(null);
  public activeProjectObs = this._activeProjectSrc.asObservable();

  private activeScene: number = 0;
  private _activeSceneSrc = new BehaviorSubject<number>(0);
  public activeSceneObs = this._activeSceneSrc.asObservable();

  private activeEvent: number = 0;
  private _activeEventSrc = new BehaviorSubject<number>(0);
  public activeEventObs = this._activeEventSrc.asObservable();

  constructor(private _electron: ElectronService, private _snackbar: MatSnackBar) { }

  async GetAllProjects(): Promise<IProject[]> {
    return await this._electron.ipcRenderer.invoke("GetAllProjects");
  }

  async CreateProject(project: IProject): Promise<void> {
    await this._electron.ipcRenderer.invoke("CreateProject", project);
  }

  async OpenProject(project: string): Promise<void> {
    await this._electron.ipcRenderer.invoke("OpenProject", project);
  }

  async GetActiveProject(): Promise<IProject> {
    if (this.activeProject !== null) {
      return this.activeProject;
    } else {
      this.activeProject = await this._electron.ipcRenderer.invoke("GetActiveProject");
      this._activeProjectSrc.next(this.activeProject);
      return this.activeProject;
    }
  }

  async CloseProject(): Promise<boolean> {
    return await this._electron.ipcRenderer.invoke("CloseProject");
  }

  async SaveProject(): Promise<void> {
    await this._electron.ipcRenderer.invoke("SaveProject", this.activeProject);

    this._snackbar.open("Project saved", "X", {
      duration: 5000
    })
  }

  async DeleteProject(project: string): Promise<boolean> {
    this.activeProject = null;
    return await this._electron.ipcRenderer.invoke("DeleteProject", project);
  }

  updateActiveProject(project: IProject) {
    this.activeProject = project;
    this._activeProjectSrc.next(project);
  }

  setActiveScene(scene: number) {
    this.activeScene = scene;
    this._activeSceneSrc.next(scene);
  }

  setActiveEvent(event: number) {
    this.activeEvent = event;
    this._activeEventSrc.next(event);
  }

  getActiveScene(): number {
    return this.activeScene;
  }

  getActiveEvent(): number {
    return this.activeEvent;
  }
}
