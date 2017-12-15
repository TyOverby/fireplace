import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DrawOptions, Span, View, Thread, Box } from '../model';
import { debouncer, calculateBox, isVisible, max_depth, countChildrenRec } from '../util';
import { MouseRegion } from '../mouseRegion';
import { State } from '../state';
import { RenderFunc } from './Fireplace';


interface GraphProps {
    state: State;
    threads: Thread[];
    render: RenderFunc;
}

export class Graph extends React.Component<GraphProps> {
    canvasDom: HTMLCanvasElement | null = null;
    canvasCtx: CanvasRenderingContext2D | null = null;
    mouseRegion: MouseRegion = new MouseRegion(() => { }, () => { });

    shouldComponentUpdate() {
        return true;
    }

    componentDidMount() {
        this.canvasDom = ReactDOM.findDOMNode(this) as HTMLCanvasElement;
        this.canvasCtx = this.canvasDom.getContext('2d');
    }

    componentDidUpdate() {
        if (this.canvasDom) {
            this.canvasDom.width = 2 * this.props.state.width;
            this.canvasDom.height = 2 * this.props.state.height;
        }
        if (this.canvasCtx) {
            this.mouseRegion = new MouseRegion(
                (state: State) => {
                    if (state.hovered_span !== null) {
                        this.props.render({ hovered_span: null });
                    }
                },
                (state: State) => { });
            this.canvasCtx.save();
            this.canvasCtx.scale(2, 2);
            draw_threads(this.props, this.canvasCtx, this.mouseRegion);
            this.canvasCtx.restore();
        }
    }

    onMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
        const target = e.currentTarget;
        this.mouseRegion.pollMove(e.clientX - target.offsetLeft, e.clientY - target.offsetTop, this.props.state);
    }

    onMouseClick(e: React.MouseEvent<HTMLCanvasElement>) {
        const target = e.currentTarget;
        this.mouseRegion.pollClick(e.clientX - target.offsetLeft, e.clientY - target.offsetTop, this.props.state);
    }

    render() {
        return <canvas
            style={({ position: 'absolute', width: this.props.state.width, height: this.props.state.height })}
            onMouseMove={e => this.onMouseMove(e)}
            onClick={e => this.onMouseClick(e)} />
    }
}

function draw_threads(props: GraphProps, canvasCtx: CanvasRenderingContext2D, mouseRegion: MouseRegion) {
    // Gap between timeline and graph
    canvasCtx.translate(0, props.state.draw_options.inter_thread_padding);
    mouseRegion.translate_y(props.state.draw_options.inter_thread_padding);

    for (const thread of props.threads) {
        const angle = (thread.id * 103969) % 360;
        const thread_box = draw_thread_box(thread, angle, canvasCtx, props.state);

        canvasCtx.fillStyle = "rgb(0, 0, 0)";
        canvasCtx.strokeStyle = "rgb(255, 100, 0)";

        let child_idx = 0;
        for (const span of thread.spans) {
            child_idx += 1;
            draw_bar(span, angle, props.state.draw_options.thread_top_padding, child_idx, props.state, props.render, canvasCtx, mouseRegion);
        }

        canvasCtx.translate(0, thread_box.h + props.state.draw_options.inter_thread_padding);
        mouseRegion.translate_y(thread_box.h + props.state.draw_options.inter_thread_padding);
    }
}

function draw_thread_box(thread: Thread, angle: number, ctx: CanvasRenderingContext2D, state: State): Box {
    const depth = max_depth(thread.spans);
    let low = thread.spans.map(s => s.start_ns).reduce((a, b) => Math.min(a, b), Infinity);
    let high = thread.spans.map(s => s.end_ns).reduce((a, b) => Math.max(a, b), -Infinity);

    if (low === Infinity || high === -Infinity) { return { x: 0, y: 0, w: 0, h: 0 }; }

    let box = calculateBox(state, low, high, 0);
    let x_2 = box.x + box.w;
    box.x = Math.max(box.x, 0);
    box.w = Math.min(x_2 - box.x, state.width);

    box.h = (depth + 1) * box.h + state.draw_options.thread_bottom_padding + state.draw_options.thread_top_padding;

    ctx.fillStyle = `hsl(${angle}, 80%, 80%)`;
    ctx.strokeStyle = `hsl(${angle}, 30%, 65%)`;
    ctx.lineWidth = state.draw_options.thread_border_width;
    ctx.setLineDash([5]);

    ctx.fillRect(box.x, box.y, box.w, box.h);
    ctx.strokeRect(box.x + 1, box.y + 1, box.w - 2, box.h - 2);
    ctx.setLineDash([]);

    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.save();
    ctx.font = "bold 10pt sans-serif"
    let x = Math.max(box.x, 0) + state.draw_options.text_padding;
    ctx.fillText(`Thread: "${thread.name}" ${thread.id}`, x, box.y + 20);
    ctx.restore();

    return box;
}

function draw_bar(span: Span, angle: number, height_offset: number, child_idx: number, state: State, render: RenderFunc, ctx: CanvasRenderingContext2D, mouseRegion: MouseRegion) {
    if (!isVisible(span, state)) { }
    const angle_delta = (child_idx + 1) * span.children.length;
    angle += angle_delta * 2;

    // Raw values
    let { x, y, w, h } = calculateBox(state, span.start_ns, span.end_ns, span.depth);
    y += height_offset;
    // rounded, TODO: perf
    const [f_x, f_y, f_w, f_h] = [x, y, w, h].map(x => Math.round(x));
    // offset, TODO: perf
    const [o_x, o_y, o_w, o_h] = [f_x, f_y, f_w, f_h].map(x => x + 0.5);

    ctx.fillStyle = `hsl(${angle}, 70%, 70%)`;
    ctx.strokeStyle = `hsl(${angle}, 40%, 50%)`;
    ctx.fillRect(f_x, f_y, f_w, f_h);
    ctx.strokeRect(x, y, w, h);
    mouseRegion.addRegion(
        { x: f_x, y: f_y, w: f_w, h: f_h },
        (state: State) => {
            if (state.hovered_span !== span) {
                render({ hovered_span: span });
            }
        },
        (state: State) => {
            if (state.selected_span !== span) {
                render({ selected_span: span });
            }
        });

    //text
    ctx.save();
    ctx.beginPath()
    ctx.rect(f_x, f_y, f_w - state.draw_options.text_padding * 1, f_h);
    ctx.clip();
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillText(span.name, Math.max(state.draw_options.text_padding, f_x + state.draw_options.text_padding), f_y + state.draw_options.text_y_offset);
    ctx.restore();

    let new_child_idx = 0;
    for (const child of span.children) {
        draw_bar(child, angle, height_offset, new_child_idx, state, render, ctx, mouseRegion);
        new_child_idx += 1;
    }
}
