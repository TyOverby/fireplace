import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DrawOptions, Span, View, Thread } from '../model';
import { Bar } from './FlameBar';
import { debouncer } from '../util';

interface GraphProps {
    draw_options: DrawOptions;
    instance_options: InstanceOptions;
    thread: Thread;
    view: View;
}

export class Graph extends React.Component<GraphProps> {
    render() {
        const bars = this.props.thread.spans.map((span, i) =>
            <Bar
                key={i}
                view={this.props.view}
                span={span}
                draw_options={this.props.draw_options}
                instance_options={this.props.instance_options} />
        )
        return <g> {bars} </g>
    }
}
