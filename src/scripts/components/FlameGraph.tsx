import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DrawOptions, Span, View, Thread } from '../model';
import { Bar } from './FlameBar';
import { debouncer } from '../util';
import { State } from '../state';

interface Box {
    x: number;
    y: number;
    w: number;
    h: number;
}

interface GraphProps {
    thread: Thread;
    state: State;
}

export class Graph extends React.Component<GraphProps> {
    canvasDom: HTMLCanvasElement | null = null;
    canvasCtx: CanvasRenderingContext2D | null = null;

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
            this.canvasCtx.save();
            this.canvasCtx.scale(2, 2);
            this.canvasCtx.fillStyle = "rgb(0, 0, 0)";
            this.canvasCtx.strokeStyle = "rgb(255, 100, 0)";

            for (const span of this.props.thread.spans) {
                draw_bar(span, this.props.state, this.canvasCtx);
            }

            this.canvasCtx.restore();
        }
    }

    render() {
        return <canvas style={({ position: 'absolute', width: this.props.state.width, height: this.props.state.height })} />
    }
}

function draw_bar(span: Span, state: State, ctx: CanvasRenderingContext2D) {
    if (!isVisible(span, state)) { }
    // Raw values
    const { x, y, w, h } = calculateBox(state, span);
    // rounded, TODO: perf
    const [f_x, f_y, f_w, f_h] = [x, y, w, h].map(x => Math.round(x));
    // offset, TODO: perf
    const [o_x, o_y, o_w, o_h] = [f_x, f_y, f_w, f_h].map(x => x + 0.5);

    ctx.fillRect(f_x, f_y, f_w, f_h);
    ctx.strokeRect(x, y, w, h);

    //text
    ctx.save();
    ctx.beginPath()
    ctx.rect(f_x, f_y, f_w - state.draw_options.text_padding * 1, f_h);
    ctx.clip();
    ctx.fillStyle = "rgb(255,0,0)";
    ctx.fillText(span.name, Math.max(0, f_x + state.draw_options.text_padding), f_y + state.draw_options.text_y_offset);
    ctx.restore();



    for (const child of span.children) {
        draw_bar(child, state, ctx);
    }
}

function isVisible(span: Span, state: State): boolean {
    const { start_ns, end_ns } = span;
    const { low, high } = state.current_view;
    return !(end_ns <= low || start_ns >= high);
}

function calculateBox(state: State, span: Span): Box {
    const { start_ns, end_ns, depth } = span;
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
