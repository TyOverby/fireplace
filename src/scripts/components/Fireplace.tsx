import * as React from "react";

import { State, defaultState } from '../state';
import { Span, DrawOptions, Thread } from "../model";
import { debouncer, calcBoundThreads } from '../util';

import { HoverBar } from './HoverBar';
import { GraphSection } from "./GraphSection";
import { Timeline } from "./Timeline";

interface FireplaceProps {
    threads: Thread[];
}

const fireplace_style: React.CSSProperties = {
    width: "100%",
    height: "100%",
    display: "grid",
    gridTemplateRows: "30px auto 2em",
};

export type RenderFunc = (state: Partial<State>) => void;

export class Fireplace extends React.Component<FireplaceProps, State> {
    debounce = debouncer();

    constructor(props: FireplaceProps) {
        super(props);
        this.state = defaultState(props.threads);
        this.setState
    }

    componentWillUnmount() {
        this.debounce('cancel');
    }

    componentWillReceiveProps(props: Readonly<FireplaceProps>) {
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

        return <div style={fireplace_style}>
            <Timeline state={this.state} render={setStateLocal} />
            <GraphSection state={this.state} threads={this.props.threads} render={setStateLocal} />
            <HoverBar hovered={this.state.hovered_span}> </HoverBar>
        </div>
    }
}

