import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ChangeEventHandler } from 'react';
import { Thread } from '../model';
import { example_threads } from '../testing';
import { AiRequests } from "./AiRequests";

type UIState = 'top-level' | 'entering-json' | 'entering-ai-deps';

interface HomepageChooserProps {
    onJsonSubmit: (threads: Thread[]) => void;
}

interface HomepageChooserState {
    state: UIState;
    content_string?: string;
}

export class HomepageChooser extends React.Component<HomepageChooserProps, HomepageChooserState> {
    constructor(props: HomepageChooserProps) {
        super(props);
        this.state = { state: 'top-level' };
    }

    onTextboxChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ content_string: event.target.value })
    }

    submitText() {
        switch (this.state.state) {
            case 'top-level':
                console.error("bad state");
                break;
            case 'entering-json':
                this.props.onJsonSubmit(JSON.parse(this.state.content_string || "[]"));
                break;
        }
    }

    render() {
        switch (this.state.state) {
            case "top-level":
                return <div id="homepage-chooser">
                    <button onClick={() => this.props.onJsonSubmit(example_threads)}> Demo Data </button>
                    <button onClick={() => this.setState({ state: 'entering-json' })}> JSON spans </button>
                    <button onClick={() => this.setState({ state: 'entering-ai-deps' })}> CSV Deps</button>
                </div>
            case "entering-json":
                const str_json = this.state.content_string || "";
                return <div id="homepage-chooser">
                    <h2> Enter Spans Json </h2>
                    <textarea contentEditable={true} onChange={(e) => this.onTextboxChange(e)} value={str_json} />
                    <br />
                    <button onClick={() => this.submitText()}> Done </button>
                </div>
            case "entering-ai-deps":
                const str_csv = this.state.content_string || "";
                return <AiRequests submit={this.props.onJsonSubmit} />
        }
    }
}
