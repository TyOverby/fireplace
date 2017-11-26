import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DrawOptions, Span, View, Thread } from '../model';
import { Bar } from './FlameBar';
import { debouncer } from '../util';
import { State } from '../state';

interface GraphProps {
    thread: Thread;
    state: State;
}

export class Graph extends React.Component<GraphProps> {
    render() {
        const bars = this.props.thread.spans.map((span, i) =>
            <Bar
                key={i}
                span={span}
                state={this.props.state} />
        )
        return <g> {bars} </g>
    }
}
