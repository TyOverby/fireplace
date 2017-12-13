export interface View {
    low: number;
    high: number;
}

export interface Box {
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface TimelineDrawOptions {
    /// The height of the timeline
    height: number;
    /// The width of each handle
    handle_width: number;
}

export interface DrawOptions {
    /// The height of the SVG bar
    bar_height: number;
    /// The amount of space left in a gap between bars
    gap_height: number;
    /// The amount of padding on the left side of the text
    text_padding: number;
    /// The distance from the top of the bar that the text should be drawn
    text_y_offset: number;
    /// The border width for the thread bounding box
    thread_border_width: number;
    /// The amount of padding at the bottom of a thread border
    thread_bottom_padding: number;
    /// The amount of padding at the top of a thread border
    thread_top_padding: number;
    // The amount of padding between thread boxes
    inter_thread_padding: number;
}

export interface Note {
    /// A short name describing what happened at some instant in time
    name: string;
    /// A longer description
    description?: string;
    /// The time that the note was added
    instant: number,

}

export interface Span {
    /// The name associated with the span
    name: string;
    /// The timestamp of the start of the span
    start_ns: number;
    /// The timestamp of the end of the span
    end_ns: number;
    /// The time that ellapsed between start_ns and end_ns
    delta: number;
    /// How deep this span is in the tree
    depth: number;
    /// A list of spans that occurred inside this one
    children: Span[];
    /// A list of notes that occurred inside this span
    notes: Note[];
}

export interface Thread {
    name: string;
    id: number;
    spans: Span[];
}
