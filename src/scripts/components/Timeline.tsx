import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { TimelineDrawOptions, View, InstanceOptions } from '../model';
import { debouncer } from '../util';
import * as state from '../state';

interface HandleProps {
    draw_options: TimelineDrawOptions;
    x: number;
    on_move: (x: number) => void;
    on_start_move: () => void;
    on_end_move: () => void;
}

interface TimelineProps {
    draw_options: TimelineDrawOptions;
    instance_options: InstanceOptions;
    view: View;
}

interface TimelineState {
    currently_dragging: boolean;
}

class Handle extends React.Component<HandleProps> {
    dom_node: SVGRectElement | null = null;
    is_mouse_down: boolean = false;

    componentDidMount() {
        this.dom_node = ReactDOM.findDOMNode(this) as SVGRectElement;

        const move_handler = (e: MouseEvent) => {
            this.props.on_move(e.clientX);
        }

        const up_handler = () => {
            this.is_mouse_down = false;
            this.props.on_end_move();
            document.removeEventListener('mousemove', move_handler);
        };

        const down_handler = () => {
            this.is_mouse_down = true;
            this.props.on_start_move();
            document.addEventListener('mouseup', up_handler);
            document.addEventListener('mousemove', move_handler);
        };

        this.dom_node.addEventListener('mousedown', down_handler);
    }

    render() {
        return <rect
            className="handle"
            x={this.props.x}
            y={0}
            width={this.props.draw_options.handle_width}
            height={this.props.draw_options.height}
            rx={2} ry={2}
            onDragStart={() => false} />
    }
}


export class Timeline extends React.Component<TimelineProps, TimelineState> {
    readonly debounce = debouncer();
    pos_1: number = 0;
    pos_2: number = 0;

    constructor(props: TimelineProps) {
        super(props);

        this.state = {
            currently_dragging: false,
        }
    }

    onStartMove() {
        this.setState({ currently_dragging: true });
    }

    onEndMove() {
        this.setState({ currently_dragging: false });
    }

    onMove(target: 'handle_1_x' | 'handle_2_x', x: number) {
        let offset = (target === 'handle_2_x') ? this.props.draw_options.handle_width : 0;
        let { handle_width } = this.props.draw_options;
        if (target === 'handle_1_x' && x + handle_width * 2 > this.pos_2) {
            x = this.pos_2 - handle_width * 2;
        } else if (target === 'handle_2_x' && x < this.pos_1 + handle_width) {
            x = this.pos_1 + handle_width * 1;
        }

        let percent_x = (x + offset) / this.props.view.width;
        let new_x = this.props.instance_options.start_x + (this.props.instance_options.end_x - this.props.instance_options.start_x) * percent_x;

        if (target === 'handle_1_x') {
            if (new_x < this.props.instance_options.start_x) {
                new_x = this.props.instance_options.start_x;
            }
            state.setView({ ... this.props.view, low: new_x });
        } else if (target === 'handle_2_x') {
            if (new_x > this.props.instance_options.end_x) {
                new_x = this.props.instance_options.end_x;
            }
            state.setView({ ... this.props.view, high: new_x });
        }
    }

    render() {
        const style: React.CSSProperties = this.state.currently_dragging ? { cursor: 'ew-resize' } : {};
        const view_delta = this.props.view.high - this.props.view.low;
        const total_delta = this.props.instance_options.end_x - this.props.instance_options.start_x;

        const view_percent_1 = (this.props.view.low - this.props.instance_options.start_x) / total_delta;
        const view_percent_2 = (this.props.view.high - this.props.instance_options.start_x) / total_delta;

        const x_1 = view_percent_1 * this.props.view.width;
        this.pos_1 = x_1;
        const x_2 = view_percent_2 * this.props.view.width;
        this.pos_2 = x_2;

        return <svg id="timeline" style={style} height={this.props.draw_options.height} onDragStart={() => false}>
            <rect className="background" width={"100%"} height={"50%"} onDragStart={() => false} />
            <rect className="background" width={"100%"} height={"100%"} rx={5} ry={5} onDragStart={() => false} />
            <rect
                id="selected-bar"
                x={x_1 + this.props.draw_options.handle_width / 2}
                y="0"
                width={x_2 - x_1 - this.props.draw_options.handle_width}
                height={this.props.draw_options.height} />
            <Handle
                x={x_1}
                draw_options={this.props.draw_options}
                on_move={x => this.onMove('handle_1_x', x)}
                on_start_move={() => this.onStartMove()}
                on_end_move={() => this.onEndMove()} />
            <Handle
                x={x_2 - this.props.draw_options.handle_width}
                draw_options={this.props.draw_options}
                on_move={x => this.onMove('handle_2_x', x)}
                on_start_move={() => this.onStartMove()}
                on_end_move={() => this.onEndMove()} />
        </svg>
    }
}
