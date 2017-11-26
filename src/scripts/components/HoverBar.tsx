import * as React from 'react';
import { Span } from '../model';
import { countChildrenRec, ownTime } from '../util';

interface HoverBarProps {
    hovered: Span | null
}

interface InfoSectionProps {
    label: string,
    value: string,
}

class InfoSection extends React.Component<InfoSectionProps> {
    render() {
        return <div className="bar-info-group">
            <span className="info-group-label"> {this.props.label} </span>
            <span className="info-group-value"> {this.props.value} </span>
        </div>
    }
}

const toMs = (nanos: number) => nanos / 1000000;

export class HoverBar extends React.Component<HoverBarProps> {
    render() {
        if (this.props.hovered === null) {
            return <div id="hover-bar" />
        } else {
            const ms = this.props.hovered.delta / 1000000;
            return <div id="hover-bar" >
                <InfoSection label="Name" value={this.props.hovered.name} />
                <InfoSection label="Delta (ms)" value={toMs(this.props.hovered.delta).toFixed(2)} />
                <InfoSection label="Own (ms)" value={toMs(ownTime(this.props.hovered)).toFixed(2)} />
                <InfoSection label="Children" value={this.props.hovered.children.length + ""} />
            </div>
        }
    }
}
