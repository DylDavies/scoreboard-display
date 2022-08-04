import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ProjectManagerService } from '../../../core/services';
import { EBackgroundMode } from '../../enums/EBackgroundMode';
import { EComponentTypes } from '../../enums/EComponentTypes';
import { IComponent } from '../../interfaces/IComponent';
import { IEvent } from '../../interfaces/IEvent';
import { IProject } from '../../interfaces/IProject';
import { IScene } from '../../interfaces/IScene';

interface IComponentStyle extends IComponent {
  style: string;
}

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {

  componentTypes = EComponentTypes;

  @ViewChild('displayContent') displayContent: ElementRef;

  @Input() border: boolean = false;
  @Input() setupMode: boolean = false;

  project: IProject;
  scene: number;
  event: number;
  backgroundComponent: IComponentStyle;
  uiComponents: IComponentStyle[];

  private initialLoadDone = false;

  constructor(
    private _renderer: Renderer2,
    private _projectManager: ProjectManagerService) { }

  ngOnInit(): void {
  }

  async loadScene() {

    this.project = await this._projectManager.GetActiveProject();
    this.scene = this._projectManager.getActiveScene();

    this._projectManager.activeProjectObs.subscribe(v => {
      this.project = v;
      this.render();
    });

    this._projectManager.activeSceneObs.subscribe(v => {
      this.scene = v;
      if (this.initialLoadDone) this.render();
    });

    this.initialLoadDone = true;
    this.render();
  }

  render() {
    if (!this.initialLoadDone) return;

    // Render background
    let bgComp = this.project.scenes[this.scene].components.find(component => component.type === EComponentTypes.Background);
    this.backgroundComponent = {
      ...bgComp,
      style: `${bgComp.background.mode == EBackgroundMode.Color ? `background-color: ${bgComp.value}` : `background: url('${bgComp.value}') 0% 0% / contain no-repeat`}; height: ${57}vh;${this.border ? " border: 10px solid #2e2e2e; border-radius: 5px;" : ""}`
    };

    // Render Text
    this.uiComponents = [...this.project.scenes[this.scene].components.filter(component => component.type === EComponentTypes.TextSolid || component.type === EComponentTypes.TextVar)]
    .map(c => {return {...c, style: `font-family: ${c.text.font.family}; font-size: ${c.text.font.size}px; color: ${c.text.font.color}; position: relative; top: ${c.position.top}%; left: ${c.position.left}%; width: ${c.size.width}%; height: ${c.size.height}%;`}});
  }
}
 