import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import 'babel-polyfill'
import classNames from 'classnames'
import Store from '../../store.js'

// Utils
import {isListBlock} from 'draftjs-utils';
import {insertBlockAfter, removeCurrentBlock, isEmptyListItem, fromHtml} from './Utils.jsx'

import Draft from 'draft-js'
const {
    Editor,
    EditorState,
    RichUtils,
    ContentState,
    CompositeDecorator,
    convertToRaw,
    SelectionState,
    convertFromHTML
} = Draft;

// Decorators
import LinkDecorator from './components/Link/LinkDecorator.jsx'
import ImageDecorator from './components/Image/ImageDecorator.jsx'

// Controls
import LinkControl from './components/Link/LinkControl.jsx'
import ImageControl from './components/Image/ImageControl.jsx'
import BlockStyleControls from './BlockStyleControls.jsx'
import InlineControls from './InlineControls.jsx'

// BlockStyleFn BlockRendere
import BlockStyleFn from './BlockStyleFn.jsx'
import MediaComponent from './MediaComponent.jsx'

// HTML
import importHtml from './html_converter/ImportHtml.jsx'
import {stateToHTML} from 'draft-js-export-html';
import {stateFromHTML} from 'draft-js-import-html';

export default class Wysiwyg extends Component {
    static defaultProps = {
        images: true
    }

    constructor(props) {
        super(props);

        const decorator = new CompositeDecorator([LinkDecorator])

        const contentState = stateFromHTML(this.props.content);
        let editorState;
        if (contentState) {
            editorState = EditorState.createWithContent(contentState, decorator)
        } else {
            editorState = EditorState.createEmpty(decorator)
        }

        this.state = { editorState: editorState }

        this.onChange = (editorState) => {
            this.setState({ editorState: editorState })

            if (this.props.onChange) {
                let newContent = stateToHTML(editorState.getCurrentContent())
                this.props.onChange(newContent)
            }
        }
        this.focus = () => {
            setTimeout(() => {
                this.refs.editor.focus();
            })
        }

        this.handleReturn = this._handleReturn.bind(this);
        this.handleKeyCommand = this._handleKeyCommand.bind(this);
        this.blockRenderer = this._blockRenderer.bind(this);
    }

    _handleReturn(e) {
        if (this._handleReturnSpecialBlock()) {
            return true;
        }

        return false;
    }

    _handleKeyCommand(command) {
        const {editorState} = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
          this.onChange(newState);
          return true;
        }
        return false;
    }

    _handleReturnSpecialBlock() {
        const {editorState} = this.state;
        const selection = editorState.getSelection();
        let newEditorState;

        if (selection.isCollapsed()) {
            const contentState = editorState.getCurrentContent();
            const blockKey = selection.getStartKey();
            const block = contentState.getBlockForKey(blockKey);
            if (!isListBlock(block) && block.getType() != 'unstyled')  {
                if (block.getLength() == selection.getStartOffset()) {
                    newEditorState = insertBlockAfter(
                        editorState,
                        blockKey,
                        'unstyled',
                        block.getData()
                    )
                }
            } else if (isEmptyListItem(block)) {
                newEditorState = removeCurrentBlock(editorState, blockKey)
            }
        }
        if (newEditorState) {
            this.onChange(newEditorState);
            return true;
        }

        return false;
    }

    _blockRenderer(block) {
        if (block.getType() === 'atomic') {
            return {
                component: MediaComponent,
                editable: false
            }
        }
    }

    render() {
        const {editorState} = this.state

        return (
            <div className="editor-root">
                <div className="editor-controls">
                    <BlockStyleControls editorState={editorState} onChange={this.onChange}/>
                    <LinkControl editorState={editorState} onChange={this.onChange} onApply={this.focus}/>
                    {this.props.images ? <ImageControl editorState={editorState} onChange={this.onChange} onApply={this.focus}/> : null}
                </div>
                <InlineControls editorState={editorState} onChange={this.onChange}/>
                <div className="editor-wrapper">
                    <Editor
                        ref='editor'
                        editorState={editorState}
                        onChange={this.onChange}
                        handleReturn={this.handleReturn}
                        handleKeyCommand={this.handleKeyCommand}
                        blockStyleFn={BlockStyleFn}
                        blockRendererFn={this.blockRenderer}
                    />
                </div>
                {/*<div>
                    {JSON.stringify(convertToRaw(editorState.getCurrentContent()))}
                </div>*/}
            </div>
        )
    }
}
