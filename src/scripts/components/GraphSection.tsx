import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DrawOptions, Span, View, Thread } from '../model';
import { Graph } from './FlameGraph';
import { debouncer } from '../util';
import { State } from '../state';
import { RenderFunc } from './Fireplace';

interface GraphSectionProps {
    state: State;
    threads: Thread[];
    render: RenderFunc;
}

export class GraphSection extends React.Component<GraphSectionProps> {
    domNode: SVGElement | null = null;
    debounce = debouncer();
    on_resize = () => this.debounce(() => this.onResize());

    constructor(props: GraphSectionProps) {
        super(props);
    }

    onResize() {
        if (this.domNode === null) { return; }
        this.props.render({
            width: this.domNode.clientWidth,
            height: this.domNode.clientHeight,
        });
    }

    shouldComponentUpdate() {
        return true;
    }

    componentDidMount() {
        this.domNode = ReactDOM.findDOMNode(this) as SVGElement;
        window.addEventListener('resize', this.on_resize);
        this.on_resize();
    }

    componentDidUpdate() {
    }

    componentWillUnmount() {
        this.debounce('cancel');
        window.removeEventListener('resize', this.on_resize);
    }

    render() {
        const threads = this.props.threads.map((thread, idx) => {
            return <Graph
                key={idx}
                threads={this.props.threads}
                state={this.props.state}
                render={this.props.render}
            />
        })
        return <div> {threads} </div>
    }
}
