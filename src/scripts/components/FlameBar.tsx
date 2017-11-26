import * as React from 'react';
import { Span, DrawOptions, View } from '../model';
import * as state from '../state';
import { State } from '../state';
import { render } from '../index';

interface Box {
    x: number;
    y: number;
    w: number;
    h: number;
}

interface BarProps {
    span: Span;
    state: State;
}

interface LabelProps {
    state: State;
    x: number;
    y: number;
    width: number;
    height: number;

    label: string;
}

class Label extends React.Component<LabelProps> {
    render() {
        const x = Math.max(0, this.props.x);
        const width_diff = this.props.x - x;
        const { draw_options } = this.props.state;
        return <foreignObject
            x={x + draw_options.text_padding}
            y={this.props.y + draw_options.text_y_offset}
            width={this.props.width - draw_options.text_padding * 2 + width_diff}
            height={this.props.height} >
            <span className="label"> {this.props.label} </span>
        </foreignObject >
    }
}

export class Bar extends React.Component<BarProps> {
    hover_start() {
        const { span, state } = this.props;
        render(state.withHovered(span));
    }

    hover_end() {
        const { state } = this.props;
        render(state.withHovered(null));
    }

    click() {
        const { span, state } = this.props;
        render(state.withSelected(span));
    }

    isVisible(): boolean {
        const { start_ns, end_ns } = this.props.span;
        const { low, high } = this.props.state.current_view;
        return !(end_ns <= low || start_ns >= high);
    }

    calculateBox(props: BarProps): Box {
        const { start_ns, end_ns, depth } = this.props.span;
        const { low: start_x, high: end_x } = this.props.state.global_view;
        const { bar_height, gap_height } = this.props.state.draw_options;
        const { low, high } = this.props.state.current_view;
        const { width } = this.props.state;

        const time_scale_factor = (high - low) / width;

        let x: number = (start_ns - start_x) / time_scale_factor - (low - start_x) / time_scale_factor;
        let y: number = depth * (bar_height + gap_height);
        let w: number = (end_ns - start_ns) / time_scale_factor;
        let h: number = bar_height;
        return { x, y, w, h }
    }

    render(): JSX.Element | null {
        if (!this.isVisible()) { return null }
        const { x, y, w, h } = this.calculateBox(this.props);

        let children = this.props.span.children.map((c, i) =>
            <Bar
                key={i}
                span={c}
                state={this.props.state}
            />
        );


        return <g>
            <g
                onClick={() => this.click()}
                onMouseOver={() => this.hover_start()}
                onMouseLeave={() => this.hover_end()}>
                <rect x={x} y={y} width={w} height={h} />
                <Label x={x} y={y} width={w} height={h} label={this.props.span.name} state={this.props.state} />
            </g>
            {children}
        </g>
    }
}
