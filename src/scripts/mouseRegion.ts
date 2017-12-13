import { Box } from './model';
import { State } from './state';

type Func = (state: State) => void;

function contains(box: Box, x: number, y: number): boolean {
    if (x < box.x || y < box.y) { return false }
    if (x > box.x + box.w || y > box.y + box.h) { return false }
    return true;
}

export class MouseRegion {
    regions: { box: Box, over: Func, click: Func }[] = [];
    noneHovered: Func;
    noneClicked: Func;
    offset_y: number = 0;

    constructor(noneHovered: Func, noneClicked: Func) {
        this.noneHovered = noneHovered;
        this.noneClicked = noneClicked;
    }

    translate_y(delta: number) {
        this.offset_y += delta;
    }

    addRegion(box: Box, over: Func, click: Func) {
        const adjusted_box = {
            x: box.x,
            y: box.y + this.offset_y,
            w: box.w,
            h: box.h
        };

        this.regions.push({
            box: adjusted_box,
            over,
            click
        });
    }

    pollMove(x: number, y: number, state: State) {
        for (const region of this.regions) {
            if (contains(region.box, x, y)) {
                region.over(state);
                return;
            }
        }

        this.noneHovered(state);
    }

    pollClick(x: number, y: number, state: State) {
        for (const region of this.regions) {
            if (contains(region.box, x, y)) {
                region.click(state);
                return;
            }
        }

        this.noneClicked(state);
    }
}
