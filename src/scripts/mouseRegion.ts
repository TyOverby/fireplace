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

    constructor(noneHovered: Func, noneClicked: Func) {
        this.noneHovered = noneHovered;
        this.noneClicked = noneClicked;
    }

    addRegion(box: Box, over: Func, click: Func) {
        this.regions.push({ box, over, click });
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
