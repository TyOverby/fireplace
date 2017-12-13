import * as model from "./model";
import { render } from "./index";
import { debouncer, calcBoundThreads, clone } from "./util";
import { Thread, TimelineDrawOptions, DrawOptions, Span, View } from "./model";

export class State {
    readonly timeline_draw_options: model.TimelineDrawOptions;
    readonly draw_options: model.DrawOptions;
    readonly threads: model.Thread[];
    readonly selected_span: model.Span | null;
    readonly hovered_span: model.Span | null;
    readonly current_view: model.View;
    readonly global_view: model.View;
    readonly width: number;
    readonly height: number;

    constructor(
        threads: Thread[],
        timeline_draw_options: TimelineDrawOptions | null = null,
        draw_options: DrawOptions | null = null,
        selected_span: Span | null = null,
        hovered_span: Span | null = null,
        current_view: View | null = null,
        global_view: View | null = null,
        width: number = 1,
        height: number = 1) {

        this.threads = threads;

        this.timeline_draw_options = timeline_draw_options || {
            height: 30,
            handle_width: 5,
        };

        this.draw_options = draw_options || {
            bar_height: 20,
            gap_height: 0,
            text_padding: 5,
            text_y_offset: 12,
            thread_border_width: 2,
            thread_bottom_padding: 10,
            thread_top_padding: 30,
            inter_thread_padding: 20,
        };

        this.selected_span = selected_span;

        this.hovered_span = hovered_span;

        const { min, max } = calcBoundThreads(threads);
        const dist = max - min;
        const padding = dist * 0.05;

        const view = {
            low: min - padding,
            high: max + padding,
        };

        this.current_view = current_view || view;

        this.global_view = global_view || view;
        this.width = width;
        this.height = height;
    }

    withDrawOptions(draw_options: model.DrawOptions): State {
        return new State(
            this.threads,
            this.timeline_draw_options,
            draw_options,
            this.selected_span,
            this.hovered_span,
            this.current_view,
            this.global_view,
            this.width,
            this.height);
    }

    withThreads(threads: Thread[]): State {
        return new State(
            threads,
            this.timeline_draw_options,
            this.draw_options,
            null,
            null,
            null,
            null,
            this.width,
            this.height)
    }

    withView(view: Partial<model.View>): State {
        return new State(
            this.threads,
            this.timeline_draw_options,
            this.draw_options,
            this.selected_span,
            this.hovered_span,
            { ...this.current_view, ...view },
            this.global_view,
            this.width,
            this.height)
    }

    withSelected(span: Span | null): State {
        const view = span ? { low: span.start_ns, high: span.end_ns } : null;
        return new State(
            this.threads,
            this.timeline_draw_options,
            this.draw_options,
            span,
            this.hovered_span,
            view,
            this.global_view,
            this.width,
            this.height)
    }

    withHovered(span: Span | null): State {
        return new State(
            this.threads,
            this.timeline_draw_options,
            this.draw_options,
            this.selected_span,
            span,
            this.current_view,
            this.global_view,
            this.width,
            this.height)
    }

    withDimensions(width: number, height: number): State {
        return new State(
            this.threads,
            this.timeline_draw_options,
            this.draw_options,
            this.selected_span,
            this.hovered_span,
            this.current_view,
            this.global_view,
            width,
            height)
    }
}
