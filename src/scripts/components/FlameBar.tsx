import * as React from 'react';
import { Span, DrawOptions, InstanceOptions, View } from '../model';
import * as state from '../state';

interface Box {
    x: number;
    y: number;
    w: number;
    h: number;
}
interface BarProps {
    span: Span;
    draw_options: DrawOptions;
    instance_options: InstanceOptions;
    view: View;
}

interface LabelProps {
    draw_options: DrawOptions,
    x: number;
    y: number;
    width: number;
    height: number;

    label: string;
}

class Label extends React.Component<LabelProps> {
    render() {
        let x = Math.max(0, this.props.x);
        let width_diff = this.props.x - x;
        return <foreignObject
            x={x + this.props.draw_options.text_padding}
            y={this.props.y + this.props.draw_options.text_y_offset}
            width={this.props.width - this.props.draw_options.text_padding * 2 + width_diff}
            height={this.props.height} >
            <span className="label"> {this.props.label} </span>
        </foreignObject >
    }
}

export class Bar extends React.Component<BarProps> {
    hover_start() {
        state.setHovered(this.props.span);
    }

    hover_end() {
        if (state.state.hovered_span == this.props.span) {
            state.setHovered(null);
        }
    }

    click() {
        state.setSelected(this.props.span);
    }

    isVisible(): boolean {
        const { start_ns, end_ns } = this.props.span;
        const { low, high } = this.props.view;
        return !(end_ns <= low || start_ns >= high);
    }

    calculateBox(props: BarProps): Box {
        const { start_ns, end_ns, depth } = this.props.span;
        const { time_scale_factor, start_x } = this.props.instance_options;
        const { bar_height, gap_height } = this.props.draw_options;
        const { low, high } = this.props.view;

        let x: number = (start_ns - start_x) / time_scale_factor - (this.props.view.low - start_x) / time_scale_factor;
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
                view={this.props.view}
                span={c}
                draw_options={this.props.draw_options}
                instance_options={this.props.instance_options} />
        );


        return <g>
            <g
                onClick={() => this.click()}
                onMouseOver={() => this.hover_start()}
                onMouseLeave={() => this.hover_end()}>
                <rect x={x} y={y} width={w} height={h} />
                <Label x={x} y={y} width={w} height={h} label={this.props.span.name} draw_options={this.props.draw_options} />
            </g>
            {children}
        </g>
    }
}
