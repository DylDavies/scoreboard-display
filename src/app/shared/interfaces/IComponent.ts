import { EBackgroundMode } from "../enums/EBackgroundMode";
import { EComponentTypes } from "../enums/EComponentTypes";
import { EImageMode } from "../enums/EImageMode";

export interface IComponent {
    name: string;
    type: EComponentTypes;
    value: string;
    position?: {
        left: number;
        top: number;
    },
    size?: {
        width: number;
        height: number;
    },
    background?: {
        mode: EBackgroundMode
    },
    image?: {
        mode: EImageMode
    }
    text?: {
        font: {
            size: number;
            family: string;
            color: string;
        }
    }
}