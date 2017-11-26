import * as React from "react";
import * as ReactDOM from "react-dom";

import { example_threads } from "./testing";
import { state, State, setSelected, setTopLevel } from './state';
import { InstanceOptions, Span, DrawOptions } from "./model";

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

        const instance_options: InstanceOptions = {
            start_x: this.props.state.top_level_span.start_ns,
            end_x: this.props.state.top_level_span.end_ns,
            time_scale_factor: (high - low) / this.props.state.current_view.width,
        }

        return <div id="application">
            <Timeline draw_options={this.props.state.timeline_draw_options} view={this.props.state.current_view} instance_options={instance_options} />
            <GraphSection
                draw_options={this.props.state.draw_options}
                instance_options={instance_options}
                threads={this.props.state.threads}
                view={this.props.state.current_view}
            />
            <HoverBar hovered={this.props.state.hovered_span}> </HoverBar>
        </div>
    }
}

export function render() {
    ReactDOM.render(<Index state={state} />, document.querySelector("#container"));
}

setTopLevel(example_threads);
render();
