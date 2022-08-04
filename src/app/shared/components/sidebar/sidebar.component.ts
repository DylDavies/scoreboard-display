import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { NavStateService, ProjectManagerService } from '../../../core/services';
import { IProject } from '../../interfaces/IProject';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @ViewChild('drawer') drawer: MatDrawer;

  opened: boolean = false;

  activeProject: IProject;

  constructor(
    private _projectManager: ProjectManagerService,
    private _navState: NavStateService,
    private _router: Router) { }

  async ngOnInit(): Promise<void> {
    this.opened = this._navState.getOpened();
    this.activeProject = await this._projectManager.GetActiveProject();
  }

  public toggleSidebar(): void {
    this._navState.toggleOpened();
    this.drawer.toggle();
  }

  closeProject() {
    this._projectManager.CloseProject();
  }

  saveProject() {
    this._projectManager.SaveProject();
  }

  deleteProject() {
    this._projectManager.DeleteProject(this.activeProject.name);
  }

  goTo(route: string) {
    if (this.getRoute() !== route) {
      this._router.navigateByUrl(`/${route}`);
    }
  }

  getRoute() {
    return this._router.url.split("#")[0].slice(1, this._router.url.length);
  }
}
