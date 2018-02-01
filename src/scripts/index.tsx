import * as React from "react";
import * as ReactDOM from "react-dom";
import { HomepageChooser } from "./components/HomepageChooser";
import { Fireplace } from "./components/Fireplace";
import { example_threads } from "./testing";
import { Thread } from "./model";


type UIState = 'chooser' | 'fireplace'

type HomepageState = { st: 'chooser' } | { st: 'fireplace', data: Thread[] };

export class Homepage extends React.Component<{}, HomepageState> {
    constructor() {
        super();
        this.state = {
            st: 'chooser',
        };
    }

    renderFireplace(threads: Thread[]) {
        const hs: HomepageState = { st: 'fireplace', data: threads };
        this.setState(hs);
    }

    render() {
        switch (this.state.st) {
            case 'chooser': return <HomepageChooser onJsonSubmit={t => this.renderFireplace(t)} />;
            case 'fireplace': return <Fireplace threads={this.state.data} />
        }
    }
}

ReactDOM.render(<Homepage />, document.querySelector("#container"));
