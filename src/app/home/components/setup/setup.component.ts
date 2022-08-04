import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectManagerService } from '../../../core/services/project-manager/project-manager.service';
import { DisplayComponent } from '../../../shared/components';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { EComponentTypes } from '../../../shared/enums/EComponentTypes';
import { IProject } from '../../../shared/interfaces/IProject';
import { IScene } from '../../../shared/interfaces/IScene';
import { EBackgroundMode } from "../../../shared/enums/EBackgroundMode";
import { EImageMode } from "../../../shared/enums/EImageMode";
import templates from '../../../shared/data/Templates';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {

  componentTypes = [
    {
      name: 'Image',
      value: EComponentTypes.Image
    },
    {
      name: 'Text',
      value: EComponentTypes.TextSolid
    },
    {
      name: 'Text Variable',
      value: EComponentTypes.TextVar
    },
    {
      name: 'Video',
      value: EComponentTypes.Video
    }
  ]

  componentTypesBg = [{
    name: 'Background',
    value: EComponentTypes.Background
  }];

  backgroundModes = [
    {
      name: "Colour",
      value: EBackgroundMode.Color
    },
    {
      name: "File Image",
      value: EBackgroundMode.FileImage
    },
    {
      name: "URL Image",
      value: EBackgroundMode.UrlImage
    }
  ]

  imageModes = [
    {
      name: "File Image",
      value: EImageMode.FileImage
    },
    {
      name: "URL Image",
      value: EImageMode.UrlImage
    }
  ]

  fonts = ['Roboto', 'Open Sans', 'Lato', 'Oswald', 'Slabo 27 px', 'Roboto Condensed', 'Montserrat', 'Source Sans Pro', 'Raleway', 'PT Sans'];

  ECompTypes = EComponentTypes;
  EBGMode = EBackgroundMode;
  EImageMode = EImageMode;

  @ViewChild('sidebar') sidebar: SidebarComponent;
  @ViewChild('display') display: DisplayComponent;
  @ViewChild('comps') select: MatSelectionList;
  @ViewChild('scenes') selectScene: MatSelectionList;

  activeProject: IProject;

  activeScene: number;
  activeEvent: number;
  activeComponent: number;

  constructor(
    private _projectManager: ProjectManagerService,
    private _snackBar: MatSnackBar) { }

  async ngOnInit(): Promise<void> {
    this.activeProject = await this._projectManager.GetActiveProject();
    this._projectManager.activeProjectObs.subscribe(v => this.activeProject = v);

    this._projectManager.activeSceneObs.subscribe(v => this.activeScene = v);
    this.activeEvent = this._projectManager.getActiveEvent();
    this._projectManager.activeEventObs.subscribe(v => this.activeEvent = v);

    this.activeComponent = 0;

    this.display.loadScene();
  }

  createComponent() {
    let name = this.activeProject.scenes[this.activeScene].components[this.activeProject.scenes[this.activeScene].components.length - 1].name;
    name = isNaN(parseInt(name[name.length - 1])) ? "Component 1" : `Component ${parseInt(name[name.length - 1]) + 1}`;

    this.activeProject.scenes[this.activeScene].components.push({
      name: `${name}`,
      type: EComponentTypes.TextSolid,
      value: 'Default',
      text: {
        font: {
          family: 'Roboto',
          size: 24,
          color: '0xffffff'
        }
      },
      size: {
        width: 100,
        height: 100
      }
    });

    this._projectManager.updateActiveProject(this.activeProject);
  }

  deleteComponent(name: string) {
    this.activeProject.scenes[this.activeScene].components = this.activeProject.scenes[this.activeScene].components.filter((v, i) => {
      if (i == 0 && v.name == name) {
        this._snackBar.open("You cannot delete the background component, only change it's value", "OK", {duration: 5000});
        return true;
      }
      if (i == this.activeComponent) this.activeComponent = 0;
      return v.name != name;
    });

    this._projectManager.updateActiveProject(this.activeProject);
  }

  selectionChange() {
    if (!this.select) return;
    this.activeComponent = this.select.selectedOptions.selected[0].value;

    this._projectManager.updateActiveProject(this.activeProject);
  }

  componentTypeChange() {
    switch(this.activeProject.scenes[this.activeScene].components[this.activeComponent].type) {
      case EComponentTypes.Background:
        if (!this.activeProject.scenes[this.activeScene].components[this.activeComponent].background) {
          this.activeProject.scenes[this.activeScene].components[this.activeComponent].background = {
            mode: EBackgroundMode.Color
          }
        }
        break;
       case EComponentTypes.Image:
        if (!this.activeProject.scenes[this.activeScene].components[this.activeComponent].image) {
          this.activeProject.scenes[this.activeScene].components[this.activeComponent].image = {
            mode: EImageMode.FileImage
          }
        }
        break;
      case EComponentTypes.TextSolid:
      case EComponentTypes.TextVar:
        if (!this.activeProject.scenes[this.activeScene].components[this.activeComponent].text) {
          this.activeProject.scenes[this.activeScene].components[this.activeComponent].text = {
            font: {
              family: "Monteserrat",
              size: 32,
              color: "0xFFFFFF"
            }
          }
        }
        break;
    }

    switch (this.activeProject.scenes[this.activeScene].components[this.activeComponent].type) {
      case EComponentTypes.Image:
        case EComponentTypes.TextSolid:
        case EComponentTypes.TextVar:
          if (!this.activeProject.scenes[this.activeScene].components[this.activeComponent].position) {
            this.activeProject.scenes[this.activeScene].components[this.activeComponent].position = {
              left: 0,
              top: 0
            } 
          }
          if (!this.activeProject.scenes[this.activeScene].components[this.activeComponent].size) {
            this.activeProject.scenes[this.activeScene].components[this.activeComponent].size = {
              width: 10,
              height: 10
            }
          }
          break;
    }

    this._projectManager.updateActiveProject(this.activeProject);
  }

  createVariable() {
    let name = this.activeProject.events[this.activeEvent].variables.length > 0 ? this.activeProject.events[this.activeEvent].variables[this.activeProject.events[this.activeEvent].variables.length - 1].name : "0";
    name = isNaN(parseInt(name[name.length - 1])) ? "Variable 1" : `Variable ${parseInt(name[name.length - 1]) + 1}`;

    for (let i = 0; i < this.activeProject.events.length; i++) {
      this.activeProject.events[i].variables.push({
        name: `${name}`,
        value: ''
      });
    }

    this._projectManager.updateActiveProject(this.activeProject);
  }

  deleteVariable(name: string) {
    this.activeProject.events[this.activeEvent].variables = this.activeProject.events[this.activeEvent].variables.filter(v => v.name != name);

    for (let i = 0; i < this.activeProject.events.length; i++) {
      this.activeProject.events[i].variables = this.activeProject.events[i].variables.filter(v => v.name != name);
    }

    this._projectManager.updateActiveProject(this.activeProject);
  }

  createScene() {
    let name = this.activeProject.scenes[this.activeProject.scenes.length - 1].name;
    name = isNaN(parseInt(name[name.length - 1])) ? "Scene 1" : `Scene ${parseInt(name[name.length - 1]) + 1}`;

    let temp: IScene = {...templates[this.activeProject.type].scenes[0]};

    temp.name = `${name}`;

    this.activeProject.scenes.push(temp);

    this._projectManager.updateActiveProject(this.activeProject);
  }

  deleteScene(name: string) {
    this.activeProject.scenes = this.activeProject.scenes.filter((v, i) => {
      if (i == 0 && v.name == name) {
        this._snackBar.open("You cannot delete the Main Scene", "OK", {duration: 5000});
        return true;
      }
      if (v == this.activeProject.scenes[this.activeScene]) this._projectManager.setActiveScene(0);
      return v.name != name;
    });

    this._projectManager.updateActiveProject(this.activeProject);
  }

  selectionChangeScene() {
    if (!this.selectScene) return;
    this._projectManager.setActiveScene(this.selectScene.options.toArray().findIndex(v => v.value == this.selectScene.selectedOptions.selected[0].value));

    this._projectManager.updateActiveProject(this.activeProject);
  }

  createEvent() {
    let name = this.activeProject.events.length > 0 ? this.activeProject.events[this.activeProject.events.length - 1].name : "0";
    name = isNaN(parseInt(name[name.length - 1])) ? "Event 1" : `Event ${parseInt(name[name.length - 1]) + 1}`;

    this.activeProject.events.push({
      name: `${name}`,
      variables: [...this.activeProject.events[0].variables]
    });

    this._projectManager.updateActiveProject(this.activeProject);
  }

  deleteEvent(name: string) {
    this.activeProject.events = this.activeProject.events.filter((v, i) => {
      if (i == 0 && v.name == name) {
        this._snackBar.open("You cannot delete the initial event", "OK", {duration: 5000});
        return true;
      }
      if (v == this.activeProject.events[this.activeEvent]) this._projectManager.setActiveEvent(0);
      return v.name != name;
    });

    this._projectManager.updateActiveProject(this.activeProject);
  }

  onKeyUp(key: KeyboardEvent) {
    if (key.key == "Enter") this._projectManager.updateActiveProject(this.activeProject);
  }
}
