import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AiDependency, AiRequest } from '../application_insights/types';
import { Thread } from '../model';
import { run_ai_query } from '../application_insights/fetcher';
import { depsToSpans } from '../application_insights/deps_to_spans';

type AiRequestsProps = {
    submit: (threads: Thread[]) => void;
}

type AiRequestsState =
    {
        kind: 'loading'
    } |
    {
        kind: 'error',
        message: string,
    } |
    {
        kind: 'listing',
        requests: AiRequest[],
    };

export class AiRequests extends React.Component<AiRequestsProps, AiRequestsState> {
    constructor(props: AiRequestsProps) {
        super(props);
        this.state = { kind: 'loading' };
        const run_requests = run_ai_query<AiRequest>(`
        requests
        | where timestamp > ago(1d)
        | where url contains "workspace/run"
        `.trim()).then(requests => {
                const state: AiRequestsState = { kind: 'listing', requests };
                this.setState(state);
            });
    }

    render() {
        switch (this.state.kind) {
            case 'loading': return <div> <h1> LOADING</h1> </div>;
            case 'error': return <div> <h1> ERROR </h1> {this.state.message} </div>;
            case 'listing': return this.renderLists(this.state.requests);
        }
        return <div>
        </div>
    }

    renderLists(requests: AiRequest[]): JSX.Element {
        const max_duration = requests.reduce((a, r) => Math.max(a, r.duration), 0.0);

        requests.sort((a, b) => b.duration - a.duration);
        const genRow = (req: AiRequest, id: number) => {
            const color = req.resultCode >= 500 && req.resultCode < 600 ? "#ff8080" : "#93df93";
            const percent = (100 * req.duration / max_duration) + "%";
            const style: React.CSSProperties = {
                backgroundColor: color,
                fontFamily: 'sans-serif',
                float: 'none',
                width: percent,
                margin: "0",
                marginBottom: "4px",
                cursor: 'pointer',
                padding: "4px",
            };

            const onClick = async () => {
                this.setState({ kind: 'loading' });
                const inner_deps = await run_ai_query<AiDependency>(`dependencies | where operation_Id startswith "${req.id}"`);
                const threads = depsToSpans(inner_deps);
                this.props.submit(threads);
            };

            return <div key={id} style={style} onClick={onClick}>
                {req.resultCode} |
                <code> {req.id.substring(1)} </code>
            </div>
        }

        return <div> {requests.map(genRow)} </div>
    }
}
