import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { TimelineDrawOptions, View } from '../model';
import { debouncer } from '../util';
import { State } from '../state';
import { RenderFunc } from './Fireplace';
import { MouseEvent } from 'react';


interface TimelineProps {
    state: State,
    render: RenderFunc;
}

interface TimelineState {
    currently_dragging: boolean;
}

export class Timeline extends React.Component<TimelineProps, TimelineState> {
    pos_1: number = 0;
    pos_2: number = 0;
    selected: "low" | "high" | "none" = "none";
    mouse_x: number = 0;
    offset_x: number = 0;

    canvasDom: HTMLCanvasElement | null = null;
    canvasCtx: CanvasRenderingContext2D | null = null;

    moveListener: ((e: any) => void) | null = null;
    upListener: (() => void) | null = null;

    componentDidMount() {
        this.canvasDom = ReactDOM.findDOMNode(this) as HTMLCanvasElement;
        this.canvasCtx = this.canvasDom.getContext('2d');
        this.canvasDom.width = this.props.state.width;
        const { height } = this.props.state.timeline_draw_options;
        this.canvasDom.height = height;
    }

    componentWillUnmount() {
        window.removeEventListener("mousemove", this.moveListener as any);
        window.removeEventListener("mouseup", this.upListener as any);
    }

    componentDidUpdate() {
        if (this.canvasDom) {
            const { height } = this.props.state.timeline_draw_options;
            this.canvasDom.width = this.props.state.width;
            this.canvasDom.height = height;
        }
        this.draw();
    }

    constructor(props: TimelineProps) {
        super(props);

        this.state = {
            currently_dragging: false,
        }
    }

    onMouseDown(mousedown: MouseEvent<HTMLCanvasElement>) {
        if (this.canvasDom === null) { return; }
        this.offset_x = this.canvasDom.offsetLeft;

        let x = mousedown.clientX - this.offset_x;
        console.log(x);
        let { handle_width } = this.props.state.timeline_draw_options;
        if (x >= this.pos_1 && x <= this.pos_1 + handle_width) {
            this.selected = "low";
        } else if (x >= this.pos_2 - handle_width && x <= this.pos_2) {
            this.selected = "high";
        }

        if (this.moveListener) {
            document.removeEventListener("mousemove", this.moveListener);
            this.moveListener = null;
        }
        if (this.upListener) {
            document.removeEventListener("mousemove", this.upListener);
            this.moveListener = null;
        }

        this.moveListener = (e: any) => {
            this.onMouseMove(e.clientX - this.offset_x);
        }

        this.upListener = () => {
            document.removeEventListener("mousemove", this.moveListener as any);
            this.onMouseUp();
        };

        document.addEventListener('mousemove', this.moveListener);
        document.addEventListener('mouseup', this.upListener);
    }

    onMouseMove(x: number) {
        if (this.selected == "none") {
            return;
        }

        let offset = 0;
        let { width, global_view } = this.props.state;
        let percent_x = (x + offset) / width;
        let new_x = global_view.low + (this.props.state.global_view.high - this.props.state.global_view.low) * percent_x;

        if (this.selected == "low") {
            this.props.render({
                current_view: {
                    low: new_x,
                    high: this.props.state.current_view.high,
                }
            });
        } else if (this.selected == "high") {
            this.props.render({
                current_view: {
                    low: this.props.state.current_view.low,
                    high: new_x,
                }
            });
        }
    }

    onMouseUp() {
        this.selected = "none";
    }

    render() {
        const { height } = this.props.state.timeline_draw_options;
        const style = { width: this.props.state.width, height: height }

        return <canvas
            style={style}
            onMouseDown={e => this.onMouseDown(e)}
            onMouseMove={e => { this.mouse_x = e.clientX - this.offset_x; this.draw() }}
        />
    }

    draw() {
        if (this.canvasCtx === null) {
            return;
        }

        const { height } = this.props.state.timeline_draw_options;
        const { width } = this.props.state;
        const handle_width = Math.round(this.props.state.timeline_draw_options.handle_width);

        const hover_style: React.CSSProperties = this.state.currently_dragging ? { cursor: 'ew-resize' } : {};
        const view_delta = this.props.state.current_view.high - this.props.state.current_view.low;
        const total_delta = this.props.state.global_view.high - this.props.state.global_view.low;

        const view_percent_1 = (this.props.state.current_view.low - this.props.state.global_view.low) / total_delta;
        const view_percent_2 = (this.props.state.current_view.high - this.props.state.global_view.low) / total_delta;

        const x_1 = Math.round(view_percent_1 * width);
        this.pos_1 = x_1;
        const x_2 = Math.round(view_percent_2 * width);
        this.pos_2 = x_2;

        let { background_style, handle_selected_style, handle_style, middle_style } = this.props.state.timeline_draw_options;

        this.canvasCtx.fillStyle = middle_style;
        this.canvasCtx.fillRect(x_1, 0.0, x_2 - x_1, height);

        if (this.selected == "low" || this.mouse_x && this.mouse_x >= x_1 && this.mouse_x <= x_1 + handle_width) {
            this.canvasCtx.fillStyle = handle_selected_style;
        } else {
            this.canvasCtx.fillStyle = handle_style;
        }
        this.canvasCtx.fillRect(x_1, 0.0, handle_width, height);

        if (this.selected == "high" || this.mouse_x && this.mouse_x >= x_2 - handle_width && this.mouse_x <= x_2) {
            this.canvasCtx.fillStyle = handle_selected_style;
        } else {
            this.canvasCtx.fillStyle = handle_style;
        }
        this.canvasCtx.fillRect(x_2 - handle_width, 0.0, handle_width, height);
    }
}
