import { EBackgroundMode } from "../enums/EBackgroundMode";
import { EComponentTypes } from "../enums/EComponentTypes";
import { IEvent } from "../interfaces/IEvent";
import { IScene } from "../interfaces/IScene";

let Templates: {[key: string]: {scenes: IScene[], events: IEvent[]}} = {
    "Athletics": {
      scenes: [
        {
          name: "Main",
          components: [
            {
              name: "Background",
              type: EComponentTypes.Background,
              value: "https://www.golegal.co.za/wp-content/uploads/2020/09/Return_of_Sports.jpg",
              background: {
                mode: EBackgroundMode.UrlImage
              }
            }
          ]
        }
      ],
      events: [
        {
          name: "100M",
          variables: []
        }
      ]
    }
}

export default Templates;