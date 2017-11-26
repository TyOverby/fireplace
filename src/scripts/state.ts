import * as model from "./model";
import { render } from "./index";
import { debouncer, calcBoundThreads } from "./util";

export interface State {
    timeline_draw_options: model.TimelineDrawOptions;
    draw_options: model.DrawOptions;
    threads: model.Thread[];
    selected_span: model.Span | null;
    hovered_span: model.Span | null;
    current_view: model.View | null;
    global_view: model.View | null;
}

export let state: State = {
    timeline_draw_options: {
        height: 30,
        handle_width: 5,
    },
    draw_options: {
        bar_height: 20,
        gap_height: 0,
        text_padding: 3,
        text_y_offset: 2,
    },
    threads: [],
    selected_span: null,
    hovered_span: null,
    current_view: null,
    global_view: null,
}

const debounce = debouncer();

export function setDrawOptions(draw_options: model.DrawOptions) {
    state.draw_options = draw_options;
    debounce(() => render());
}

export function setTopLevel(threads: model.Thread[]) {
    state.threads = threads;
    let { min, max } = calcBoundThreads(threads);
    state.current_view = state.global_view = {
        low: min,
        high: max,
        width: (state.current_view && state.current_view.width) || 1
    };
    debounce(() => render());
}

export function setView(view: model.View) {
    state.current_view = view;
    debounce(() => render());
}

export function setSelected(span: model.Span) {
    state.selected_span = span;

    setView({
        low: span.start_ns,
        high: span.end_ns,
        width: (state.current_view && state.current_view.width) || 1
    });
}

export function setHovered(span: model.Span | null) {
    state.hovered_span = span;
    debounce(() => render());
}
