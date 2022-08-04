import { IEvent } from "./IEvent";
import { IScene } from "./IScene";

export interface IProject {
    name: string;
    type: string;
    date: string;
    aspectRatio: {
        x: number;
        y: number;
    }
    scenes: IScene[];
    events: IEvent[];
}