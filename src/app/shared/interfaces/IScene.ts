import { IComponent } from "./IComponent";

export interface IScene {
    name: string;
    components: IComponent[];
}