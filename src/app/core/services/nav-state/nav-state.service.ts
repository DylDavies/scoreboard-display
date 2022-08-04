import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavStateService {

  private opened: boolean = false;

  constructor() { }

  toggleOpened() {
    this.opened = !this.opened;
  }

  getOpened(): boolean {
    return this.opened;
  }
}
