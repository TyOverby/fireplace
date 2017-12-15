import * as React from "react";
import * as ReactDOM from "react-dom";
import { Fireplace } from "./components/Fireplace";
import { example_threads } from "./testing";

ReactDOM.render(<Fireplace threads={example_threads} />, document.querySelector("#container"));
