import * as React from "react";

export interface RecipeProps {
    name: string;
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export class Recipe extends React.Component<RecipeProps> {
    render() {
        return <h1>Hello from {this.props.name} </h1>;
    }
}
