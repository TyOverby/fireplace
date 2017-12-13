import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DrawOptions, Span, View, Thread } from '../model';
import { Graph } from './FlameGraph';
import { debouncer } from '../util';
import { State } from '../state';
import { render } from '../index';

interface GraphSectionProps {
    state: State;
}

export class GraphSection extends React.Component<GraphSectionProps> {
    domNode: SVGElement | null = null;
    debounce = debouncer();
    on_resize = () => this.debounce(() => this.onResize());

    constructor() {
        super();
    }

    onResize() {
        if (this.domNode === null) { return; }
        render(this.props.state.withDimensions(this.domNode.clientWidth, this.domNode.clientHeight));
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
        const threads = this.props.state.threads.map((thread, idx) =>
            < Graph
                key={idx}
                state={this.props.state}
            />)
        return <div> {threads} </div>
    }
}
