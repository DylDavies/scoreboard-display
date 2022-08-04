import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectManagerService } from '../../../core/services';
import { DisplayComponent } from '../../../shared/components';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { IProject } from '../../../shared/interfaces/IProject';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  @ViewChild('sidebar') sidebar: SidebarComponent;
  @ViewChild('display') display: DisplayComponent;

  activeProject: IProject;
  
  constructor(
    private _projectManager: ProjectManagerService) { }

  async ngOnInit(): Promise<void> {
    this.activeProject = await this._projectManager.GetActiveProject();

    this.display.loadScene();
  }

}
