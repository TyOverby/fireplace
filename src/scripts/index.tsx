import * as React from "react";
import * as ReactDOM from "react-dom";

import { example_threads } from "./testing";
import { State, defaultState } from './state';
import { Span, DrawOptions, Thread } from "./model";
import { debouncer, calcBoundThreads } from './util';

import { HoverBar } from './components/HoverBar';
import { GraphSection } from "./components/GraphSection";
import { Timeline } from "./components/Timeline";

interface IndexProps {
    threads: Thread[];
}

export type RenderFunc = (state: Partial<State>) => void;

export class Index extends React.Component<IndexProps, State> {
    debounce = debouncer();

    constructor(props: IndexProps) {
        super(props);
        this.state = defaultState(props.threads);
        this.setState
    }

    componentWillUnmount() {
        this.debounce('cancel');
    }

    componentWillReceiveProps(props: Readonly<IndexProps>) {
        const { min, max } = calcBoundThreads(props.threads);
        const dist = max - min;
        const padding = dist * 0.05;

        const view = {
            low: min - padding,
            high: max + padding,
        };

        this.setState({ current_view: view, global_view: view });
    }

    render() {
        if (!this.state.current_view) {
            return <div />
        }

        const { low, high } = this.state.current_view;

        const that = this;
        function setStateLocal(ns: Partial<State>) {
            that.setState(ns as any);
        }

        return <div id="application">
            <Timeline state={this.state} render={setStateLocal} />
            <GraphSection state={this.state} threads={this.props.threads} render={setStateLocal} />
            <HoverBar hovered={this.state.hovered_span}> </HoverBar>
        </div>
    }
}

ReactDOM.render(<Index threads={example_threads} />, document.querySelector("#container"));
