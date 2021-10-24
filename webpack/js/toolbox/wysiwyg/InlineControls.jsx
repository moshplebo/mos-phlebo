import React, {Component} from 'react'
import classNames from 'classnames'
import Store from '../../store.js'
import {InlineMap} from './InlineMap.jsx'
import Draft, {RichUtils} from 'draft-js'

export default class InlineControls extends Component {
    changeInlineStyle(e, style) {
        e.preventDefault();
        const {editorState, onChange} = this.props;
        const newEditorState = RichUtils.toggleInlineStyle(editorState, style);
        onChange(newEditorState);
    }

    render() {
        const {editorState} = this.props;
        let inlineControls = InlineMap.map((inline) => {
            let is_active = editorState.getCurrentInlineStyle().has(inline.style)

            return (
                <i key={inline.style} onMouseDown={(e) => this.changeInlineStyle(e, inline.style)} className={classNames("editor-styleButton", {"editor-activeButton": is_active}, inline.icon)} title={inline.label}/>
            )
        });

        return (
            <span>
                {inlineControls}
            </span>
        )
    }
}
