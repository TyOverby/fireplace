import * as React from 'react';
import { Span } from '../model';
import { countChildrenRec, ownTime } from '../util';

const bar_info_group_style: React.CSSProperties = {
    float: "left",
    padding: "5px",
    fontFamily: "sans-serif",
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const info_group_label_style: React.CSSProperties = {
    textTransform: "uppercase",
    color: "grey",
    fontSize: "0.7em",
    marginRight: "5px",
};

const hover_bar_style: React.CSSProperties = {
    background: "rgb(21, 23, 34)",
    color: "white",

    display: "flex",
    flexDirection: "row",
    overflow: "hidden",
};

interface HoverBarProps {
    hovered: Span | null
}

interface InfoSectionProps {
    label: string,
    value: string,
}

class InfoSection extends React.Component<InfoSectionProps> {
    render() {
        return <div style={bar_info_group_style}>
            <span style={info_group_label_style}> {this.props.label} </span>
            <span> {this.props.value} </span>
        </div>
    }
}

const toMs = (nanos: number) => nanos / 1000000;

export class HoverBar extends React.Component<HoverBarProps> {
    render() {
        if (this.props.hovered === null) {
            return <div style={hover_bar_style} />
        } else {
            const ms = this.props.hovered.delta / 1000000;
            return <div style={hover_bar_style} >
                <InfoSection label="Name" value={this.props.hovered.name} />
                <InfoSection label="Delta (ms)" value={toMs(this.props.hovered.delta).toFixed(2)} />
                <InfoSection label="Own (ms)" value={toMs(ownTime(this.props.hovered)).toFixed(2)} />
                <InfoSection label="Children" value={this.props.hovered.children.length + ""} />
            </div>
        }
    }
}
