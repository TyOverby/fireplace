import * as React from "react";
import * as ReactDOM from "react-dom";

import { example_threads } from "./testing";
import { State } from './state';
import { Span, DrawOptions } from "./model";
import { debouncer } from './util';

import { HoverBar } from './components/HoverBar';
import { GraphSection } from "./components/GraphSection";
import { Timeline } from "./components/Timeline";

interface IndexProps {
    state: State
}

export class Index extends React.Component<IndexProps> {
    render() {
        if (!this.props.state.current_view) {
            return <div />
        }

        //const timing_span = this.props.state.selected_span || this.props.state.top_level_span;
        const { low, high } = this.props.state.current_view;

        return <div id="application">
            <Timeline state={this.props.state} />
            <GraphSection state={this.props.state} />
            <HoverBar hovered={this.props.state.hovered_span}> </HoverBar>
        </div>
    }
}

const debounce = debouncer();

export function render(state: State) {
    debounce(() => {
        ReactDOM.render(<Index state={state} />, document.querySelector("#container"));
    });
}

render(new State(example_threads));
