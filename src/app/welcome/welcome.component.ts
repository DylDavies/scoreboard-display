import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectManagerService } from '../core/services';
import { IProject } from '../shared/interfaces/IProject';

@Component({
  selector: 'app-home',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  _projects: IProject[];

  constructor(private router: Router, private _projectManager: ProjectManagerService) { }

  async ngOnInit(): Promise<void> {
    this._projects = await this._projectManager.GetAllProjects();
  }

  openProject(project: string) {
    this._projectManager.OpenProject(project);
  }
}
