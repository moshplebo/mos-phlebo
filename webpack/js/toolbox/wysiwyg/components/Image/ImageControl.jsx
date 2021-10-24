import React, {Component} from 'react'
import classNames from 'classnames'
import Store from '../../../../store.js'
import MediaLibrary from '../../../MediaLibrary.jsx'

import {
    getSelectionEntity,
} from 'draftjs-utils';

import Draft from 'draft-js'
const {
    ContentState,
    EditorState,
    AtomicBlockUtils
} = Draft;

export default class ImageControl extends Component {
    constructor(props) {
        super(props)

        const {editorState} = this.props;

        if (editorState) {
            this.state = {
                currentEntity: getSelectionEntity(editorState)
            }
        }

        this.applyImage = this._applyImage.bind(this);
        this.selectFile = this._selectFile.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const {editorState} = nextProps;

        if (editorState && editorState != this.props.editorState) {
            this.setState({
                currentEntity: getSelectionEntity(editorState)
            })
        }
    }

    _applyImage(src) {
        const {editorState, onChange, onApply} = this.props;
        const contentState = editorState.getCurrentContent();

        const newContentState = contentState.createEntity(
            'IMAGE',
            'IMMUTABLE',
            {src}
        );

        let newEditorState = EditorState.set(
            editorState,
            { currentContent: newContentState }
        )

        onChange(AtomicBlockUtils.insertAtomicBlock(
            editorState,
            newContentState.getLastCreatedEntityKey(),
            ' '
        ));
        onApply();
    }

    _selectFile() {
        let onFileSelect = (data) => {
            this.applyImage(data.src);
            Store.setData({ modal: false, modalData: {} }, true)
        }

        let modalContent = <MediaLibrary key={(+ new Date).toString()} url="/admin/media_library/images"
            onSelect={onFileSelect}/>

        Store.setData({ modal: true, modalData: { content: modalContent } }, true);
    }

    render() {
        return (
            <span>
                <i onClick={this.selectFile} className='editor-styleButton mdi mdi-file-image' title='Добавить изображение'/>
            </span>
        )
    }
}
