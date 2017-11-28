import { Span, Thread, Box } from "./model";
import { State } from "./state";

export function countChildrenRec(span: Span): number {
    return span.children.length + span.children.map(countChildrenRec).reduce((a, b) => a + b, 0)
}

export function ownTime(span: Span): number {
    return span.delta - span.children.reduce((a, b) => a + b.delta, 0)
}

export function clone<T>(a: T): T {
    return JSON.parse(JSON.stringify(a));
}

export function calcBoundThreads(threads: Thread[]): { min: number, max: number } {
    let min = Infinity;
    let max = -Infinity;

    for (const thread of threads) {
        let { min: x, max: y } = calcBoundSpans(thread.spans);
        min = Math.min(min, x);
        max = Math.max(max, y);
    }
    return { min, max };
}

export function calcBoundSpans(spans: Span[]): { min: number, max: number } {
    let min = Infinity;
    let max = -Infinity;

    for (const span of spans) {
        min = Math.min(span.start_ns);
        max = Math.max(span.end_ns);
    }
    return { min, max };
}


type Func = () => void;

export function debouncer(): (f: Func | 'cancel') => void {
    let to_execute: Func | null = null;
    let animation_request = 0;

    return function (f: Func | 'cancel') {
        if (f == 'cancel') {
            window.cancelAnimationFrame(animation_request);
            return;
        }

        to_execute = f;
        if (animation_request == 0) {
            animation_request = window.requestAnimationFrame(() => {
                animation_request = 0;
                if (to_execute) {
                    to_execute();
                }
            });
        }
    }
}

export function max_depth(spans: Span[]): number {
    let max = 0;
    for (const span of spans) {
        max = Math.max(max, span.depth);
        max = Math.max(max, max_depth(span.children));
    }
    return max
}

export function calculateBox(state: State, start_ns: number, end_ns: number, depth: number): Box {
    const { low: start_x, high: end_x } = state.global_view;
    const { bar_height, gap_height } = state.draw_options;
    const { low, high } = state.current_view;
    const { width } = state;

    const time_scale_factor = (high - low) / width;

    let x: number = (start_ns - start_x) / time_scale_factor - (low - start_x) / time_scale_factor;
    let y: number = depth * (bar_height + gap_height);
    let w: number = (end_ns - start_ns) / time_scale_factor;
    let h: number = bar_height;
    return { x, y, w, h }
}


export function isVisible(span: Span, state: State): boolean {
    const { start_ns, end_ns } = span;
    const { low, high } = state.current_view;
    return !(end_ns <= low || start_ns >= high);
}
