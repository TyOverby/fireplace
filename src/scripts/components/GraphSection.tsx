import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DrawOptions, Span, InstanceOptions, View, Thread } from '../model';
import { Graph } from './FlameGraph';
import { debouncer } from '../util';
import * as state from '../state';

interface GraphSectionProps {
    draw_options: DrawOptions;
    instance_options: InstanceOptions;
    threads: Thread[];
    view: View;
}

export class GraphSection extends React.Component<GraphSectionProps> {
    domNode: SVGElement | null = null;
    debounce = debouncer();
    on_resize = () => this.debounce(() => this.onResize());

    constructor() {
        super();
    }

    onResize() {
        if (this.domNode === null || state.state.current_view === null) { return; }
        state.setView({ ...state.state.current_view, width: this.domNode.clientWidth });
    }

    componentDidMount() {
        this.domNode = ReactDOM.findDOMNode(this) as SVGElement;
        window.addEventListener('resize', this.on_resize);
        this.on_resize();
    }

    componentWillUnmount() {
        this.debounce('cancel');
        window.removeEventListener('resize', this.on_resize);
    }

    render() {
        const threads = this.props.threads.map((thread, idx) =>
            < Graph
                draw_options={this.props.draw_options}
                instance_options={this.props.instance_options}
                thread={thread}
                view={this.props.view}
            />)
        return <div> <svg className="graph">
            <g className="thread-group">
                {threads}
            </g>
        </svg></div>
    }
}
