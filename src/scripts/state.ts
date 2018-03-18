import * as model from "./model";
import { debouncer, calcBoundThreads, clone } from "./util";
import { Thread, TimelineDrawOptions, DrawOptions, Span, View } from "./model";

export interface State {
    readonly timeline_draw_options: model.TimelineDrawOptions;
    readonly draw_options: model.DrawOptions;
    readonly selected_span: model.Span | null;
    readonly hovered_span: model.Span | null;
    readonly current_view: model.View;
    readonly global_view: model.View;
    readonly width: number;
    readonly height: number;
}

export function defaultState(threads: Thread[]): State {
    const { min, max } = calcBoundThreads(threads);
    const dist = max - min;
    const padding = dist * 0.05;

    const view = {
        low: min - padding,
        high: max + padding,
    };

    return {
        timeline_draw_options: {
            height: 30,
            handle_width: 5,
            background_style: "blue",
            handle_selected_style: "rgb(50, 50, 50)",
            handle_style: "rgb(20, 20, 20)",
            middle_style: "rgb(220, 220, 220)",
        },
        draw_options: {
            bar_height: 20,
            gap_height: 0,
            text_padding: 5,
            text_y_offset: 12,
            thread_border_width: 2,
            thread_bottom_padding: 10,
            thread_top_padding: 30,
            inter_thread_padding: 20,
        },
        selected_span: null,
        hovered_span: null,
        current_view: view,
        global_view: view,
        width: 1,
        height: 1,
    };
}
