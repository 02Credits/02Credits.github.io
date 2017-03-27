import events from "./events";
import ces from "./ces";
import * as _ from "underscore";

export default () => {
    events.Subscribe("ces.update.collider", (entity: any) => {
        var collidables = ces.GetEntities("collidable");
        for (let collidable of collidables) {
            if (collidable !== entity) {
                var left = collidable.position.x + collidable.dimensions.width * collidable.position.cx;
                var right = collidable.position.x - collidable.dimensions.width * (1 - collidable.position.cx);
                var bottom = collidable.position.y + collidable.dimensions.height * collidable.position.cy;
                var top = collidable.position.y - collidable.dimensions.height * (1 - collidable.position.cy);

                var position: {x: number, y: number} = entity.position;
                var dimensions: {width: number, height: number} = entity.dimensions;

                var xError = 0;
                var yError = 0;

                if (position.x > collidable.position.x && position.x - dimensions.width / 2 < left &&
                    ((position.y > collidable.position.y && position.y - dimensions.height / 2 < bottom) ||
                    (position.y < collidable.position.y && position.y + dimensions.height / 2 > top))) {
                    xError = (position.x - dimensions.width / 2) - left;
                }
                if (position.x < collidable.position.x && position.x + dimensions.width / 2 > right &&
                    ((position.y > collidable.position.y && position.y - dimensions.height / 2 < bottom) ||
                    (position.y < collidable.position.y && position.y + dimensions.height / 2 > top))) {
                    xError = (position.x + dimensions.width / 2) - right;
                }
                if (position.y < collidable.position.y && position.y + dimensions.height / 2 > top &&
                    ((position.x < collidable.position.x && position.x + dimensions.width / 2 > right) ||
                    (position.x > collidable.position.x && position.x - dimensions.width / 2 < left))) {
                    yError = (position.y + dimensions.height / 2) - top;
                }
                if (position.y > collidable.position.y && position.y - dimensions.height / 2 < bottom &&
                    ((position.x < collidable.position.x && position.x + dimensions.width / 2 > right) ||
                    (position.x > collidable.position.x && position.x - dimensions.width / 2 < left))) {
                    yError = (position.y - dimensions.height / 2) - bottom;
                }

                if (xError != 0 || yError != 0) {
                    events.Publish("collision", {collider: entity, collidable: collidable, xError: xError, yError: yError});
                }
            }
        }
    });
};
