import * as React from "react";
import * as ReactDOM from "react-dom";
import { HomepageChooser } from "./components/HomepageChooser";
import { Fireplace } from "./components/Fireplace";
import { example_threads } from "./testing";
import { Thread } from "./model";
import { run_ai_query } from "./application_insights/fetcher";
import { depsToSpans } from "./application_insights/deps_to_spans";
import { AiRequest, AiDependency } from "./application_insights/types";


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

/*
async function play_with_ai() {
    const run_requests = await run_ai_query<AiRequest>(`
        requests
        | where timestamp > ago(1h)
        | where url contains "workspace/run"
    `.trim());

    const first_request = run_requests[0];
    const inner_deps = await run_ai_query<AiDependency>(`
dependencies
| where operation_Id startswith "${first_request.id}"
    `);
    const threads = depsToSpans(inner_deps);
    console.log(threads);
}

play_with_ai();
*/
