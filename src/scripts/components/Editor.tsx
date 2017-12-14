import * as React from 'react';
import { render } from 'react-dom';
import MonacoEditor from 'react-monaco-editor';

interface EditorProps { };
interface EditorState {
    code: string
};

export class Editor extends React.Component<EditorProps, EditorState> {
    constructor() {
        super();
        this.state = {
            code: '// type your code...',
        };
    }
    editorDidMount(editor: monaco.editor.ICodeEditor, monacoModule: typeof monaco) {
        editor.focus();
    }
    onChange(val: string, ev: monaco.editor.IModelContentChangedEvent) {
    }
    render() {
        const code = this.state.code;
        const options = {
            selectOnLineNumbers: true
        };
        return (
            <MonacoEditor
                width="800"
                height="600"
                language="javascript"
                theme="vs-dark"
                value={code}
                options={options}
                onChange={this.onChange}
                editorDidMount={this.editorDidMount}
            />
        );
    }
}
