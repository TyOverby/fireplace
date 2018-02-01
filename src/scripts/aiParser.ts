import * as csvParse from "csv-parse";
import { Thread, Span } from "./model";

export function csvToThreads(csv: string, cb: (err: any, threads: Thread[]) => void) {
    csvParse(csv, { columns: true }, (err: any, out: any) => {
        if (err) cb(err, []);
        const rows: any[] = out;

        const spans = rows.map(obj => {
            obj.endTime = new Date(obj.timestamp).getTime();
            obj.startTime = obj.endTime - (obj.duration - 0);
            obj.duration = obj.endTime - obj.startTime;
            obj.children = [];
            if (obj.customDimensions) {
                obj.customDimensions = JSON.parse(obj.customDimensions);
            }

            let span: Span & { op_id: string } = {
                name: obj.name + `(${obj.customDimensions.Category || ""})`,
                children: [],
                delta: obj.duration,
                depth: -1,
                end_ns: obj.endTime,
                notes: [],
                start_ns: obj.startTime,
                op_id: obj.operation_Id,
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

        cb(null, top);
    })
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
