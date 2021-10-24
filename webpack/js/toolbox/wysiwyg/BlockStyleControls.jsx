import React, {Component} from 'react'
import classNames from 'classnames'
import {BlockTypes} from './BlockTypes.jsx'
import Draft, {RichUtils} from 'draft-js'

export default class BlockStyleControls extends Component {
    changeBlockType(style) {
        const {editorState, onChange} = this.props;
        const newEditorState = RichUtils.toggleBlockType(editorState, style);
        onChange(newEditorState);
    }

    render() {
        const {editorState} = this.props;
        let blockControls = BlockTypes.map((type) => {
            let selection = editorState.getSelection();
            let blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();

            let props = {
                active: blockType === type.style,
                style: type.style,
                icon: type.icon
            }

            return (
                <span key={type.style} onClick={() => this.changeBlockType(type.style)} className={classNames("editor-styleButton", {"editor-activeButton": props.active}, props.icon)} title={type.label}/>
            )
        });

        return (
            <span>
                {blockControls}
            </span>
        )
    }
}
