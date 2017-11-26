import { Span, Thread } from "./model";

export function countChildrenRec(span: Span): number {
    return span.children.length + span.children.map(countChildrenRec).reduce((a, b) => a + b, 0)
}

export function ownTime(span: Span): number {
    return span.delta - span.children.reduce((a, b) => a + b.delta, 0)
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
