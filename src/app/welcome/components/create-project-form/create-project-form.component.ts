import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { ProjectManagerService } from '../../../core/services';
import { IProject } from '../../../shared/interfaces/IProject';
import templates from "../../../shared/data/Templates";

@Component({
  selector: 'create-project-form',
  templateUrl: './create-project-form.component.html',
  styleUrls: ['./create-project-form.component.scss']
})
export class CreateProjectFormComponent implements OnInit {

  types = ["Athletics"];

  @ViewChild('callForm', { static: true }) projectForm: NgForm;
  @ViewChild('fProjectName', { static: true }) projectNameModel: NgModel;
  @ViewChild('fProjectType', { static: true }) typeModel: NgModel;
  @ViewChild('fAspectX', { static: true }) aspectXModel: NgModel;
  @ViewChild('fAspectY', { static: true }) aspectYModel: NgModel;

  projectName: string = "";
  projectType: string = "";
  aspectRatio: {x: number; y: number} = {x: null, y: null};

  constructor(private _projectManager: ProjectManagerService) { }

  ngOnInit(): void {
  }

  clearForm() {
    this.projectName = "";
    this.projectType = "";
    this.aspectRatio = {x: null, y: null};
  }

  createProject() {
    let d = new Date();
    let date = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");

    let project: IProject = {
      name: this.projectName,
      type: this.projectType,
      aspectRatio: this.aspectRatio,
      date: date,
      scenes: templates[this.projectType].scenes,
      events: templates[this.projectType].events
    }

    // Create spinner
    this._projectManager.CreateProject(project);
  }
}
