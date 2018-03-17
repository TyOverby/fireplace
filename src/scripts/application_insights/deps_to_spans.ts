import * as csvParse from "csv-parse";
import { Thread, Span } from "../model";
import { AiDependency } from "./types";

export function depsToSpans(deps: AiDependency[]): Thread[] {
    const spans = deps.map(dep => {
        const endTime = dep.timestamp.getTime() * 1000000;
        const startTime = endTime - dep.duration * 1000000;

        let span: Span & { op_id: string } = {
            name: dep.name + `(${dep.customDimensions.Category || ""})`,
            children: [],
            delta: dep.duration * 1000000,
            depth: -1,
            end_ns: endTime,
            notes: [],
            start_ns: startTime,
            op_id: dep.operation_Id,
        };

        return span;
    });

    spans.sort((a, b) => {
        if (a.start_ns < b.start_ns) {
            return -1;
        }
        if (a.start_ns > b.start_ns) {
            return 1;
        }

        if (a.delta > b.delta) {
            return -1;
        }
        if (a.delta < b.delta) {
            return 1;
        }

        return 0;
    });

    const top: Thread[] = [];
    let r;
    while (r = spans.shift()) {
        r.depth = 0;
        pluck(r, spans, 1);
        top.push({
            id: 0,
            name: r.op_id,
            spans: [r]
        });
    }
    return top;
}

function pluck(me: Span, rest: Span[], depth: number) {
    let r;
    while (r = rest.shift()) {
        if (r.start_ns >= me.start_ns && r.end_ns <= me.end_ns) {
            pluck(r, rest, depth + 1);
            r.depth = depth;
            me.children.push(r);
        } else {
            rest.unshift(r);
            break;
        }
    }
}
