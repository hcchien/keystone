'use strict';
import React, { Component } from 'react';
import { Entity } from 'draft-js';

const getDisplayName = (WrappedComponent) => (
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
);

// Export
export default function WrapComponent(WrappedComponent) {
    class Wrapper extends Component {
        constructor(props) {
            super(props);
            this.align = this._align.bind(this);
            this.state = {
                alignment: props.blockProps.alignment || 'center'
            }
        }

        _align(alignment) {
            const entityKey = this.props.block.getEntityAt(0);
            if (entityKey) {
                Entity.mergeData(entityKey, { alignment });
                this.setState({alignment});

                // Force refresh
                this.props.blockProps.refreshEditorState();
            }
        }

        render() {
            return (
                <WrappedComponent {...this.props}
                    align={this.align}
                    alignment={this.state.alignment}
                />
            );
        }
    }
    Wrapper.displayName = `Decorated(${getDisplayName(WrappedComponent)})`;
    Wrapper.defaultProps = {
        readOnly: false
    };

    return Wrapper;
}
