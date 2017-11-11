import * as React from "react";
import * as ReactDOM from "react-dom";

import { Hello } from "./components/Hello";
import { Editor } from "./components/Editor";


ReactDOM.render(
    <div>
        <Hello compiler="TypeScript" framework="React" />
        <Editor />
    </div>,
    document.querySelector("#container"));
