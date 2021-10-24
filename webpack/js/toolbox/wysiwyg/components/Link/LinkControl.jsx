import React, {Component} from 'react'
import classNames from 'classnames'
import Store from '../../../../store.js'
import LinkForm from './LinkForm.jsx'

import {
    getSelectionText,
    getEntityRange,
    getSelectionEntity,
} from 'draftjs-utils';

import Draft from 'draft-js'
const {
    Modifier,
    ContentState,
    EditorState,
    RichUtils
} = Draft;

export default class LinkControl extends Component {
    constructor(props) {
        super(props)

        const {editorState} = this.props;

        if (editorState) {
            this.state = {
                currentEntity: getSelectionEntity(editorState)
            }
        }

        this.toggleLink = this._toggleLink.bind(this);
        this.confirmLink = this._confirmLink.bind(this);
        this.removeLink = this._removeLink.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const {editorState} = nextProps;

        if (editorState && editorState != this.props.editorState) {
            this.setState({
                currentEntity: getSelectionEntity(editorState)
            });
        }
    }

    _normalizeUrl(url) {
        let normalUrl = url.replace(/\Ahttps?:\/\//, '');
        if (normalUrl[0] !== '/') {
            normalUrl = '//' + normalUrl;
        }

        return normalUrl;
    }

    _toggleLink() {
        const {editorState} = this.props;
        const contentState = editorState.getCurrentContent();
        const {currentEntity} = this.state;
        let selection = editorState.getSelection();
        let modalProps = {};

        if (currentEntity) {
            modalProps = contentState.getEntity(currentEntity).data;
            modalProps.url = this._normalizeUrl(modalProps.url);
            modalProps = Object.assign({}, modalProps, {currentEntity: currentEntity})
        } else if (!selection.isCollapsed()) {
            modalProps.title = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getText().slice(selection.getStartOffset(), selection.getEndOffset());
        }
        let modalContent = (<LinkForm key='linkModal' {...modalProps} onApply={this.props.onApply} onConfirmLink={this.confirmLink}/>);
        Store.setData({modal: true, modalData: {content: modalContent}}, true);
    }

    _confirmLink(urlState) {
        const {editorState, onChange, onApply} = this.props;
        let contentState = editorState.getCurrentContent();
        const {currentEntity} = this.state;
        let selection = editorState.getSelection();
        let {title, url, target, linkRemove} = urlState;
        url = this._normalizeUrl(url);
        let entityKey;

        if (currentEntity) {
            if (linkRemove) {
                this._removeLink();
                return true;
            }
            if (url.length > 0) {
                if (title.length == 0) {
                    urlState.title = urlState.url;
                    title = urlState.url;
                }
                Entity.mergeData(currentEntity, {...urlState})
                const entityRange = getEntityRange(editorState, currentEntity);
                selection = selection.merge({
                    anchorOffset: entityRange.start,
                    focusOffset: entityRange.end
                });
                Modifier.applyEntity(
                    editorState.getCurrentContent(),
                    selection,
                    currentEntity
                );
                entityKey = currentEntity;
            } else {
                return true;
            }
        } else {
            contentState = contentState.createEntity(
                'LINK',
                'MUTABLE',
                {url: url, title: title, target: target}
            );
            entityKey = contentState.getLastCreatedEntityKey()
        }


        let newContentState = Modifier.replaceText(
            contentState,
            selection,
            title,
            editorState.getCurrentInlineStyle(),
            entityKey
        );

        let newEditorState = EditorState.push(editorState, newContentState, 'insert-characters');

        // insert a blank space after link without entity
        selection = newEditorState.getSelection().merge({
            anchorOffset: selection.get('anchorOffset') + title.length,
            focusOffset: selection.get('anchorOffset') + title.length,
        });
        newEditorState = EditorState.acceptSelection(newEditorState, selection);
        newContentState = Modifier.insertText(
            newEditorState.getCurrentContent(),
            selection,
            ' ',
            newEditorState.getCurrentInlineStyle(),
            undefined
        );

        onChange(EditorState.push(editorState, newContentState, 'insert-characters'));
        onApply();
    }

    _removeLink() {
        const {editorState, onChange, onApply} = this.props;
        const {currentEntity} = this.state;
        let selection = editorState.getSelection();

        if (currentEntity) {
            const entityRange = getEntityRange(editorState, currentEntity);
            let newSelection = selection.merge({
                anchorOffset: entityRange.start,
                focusOffset: entityRange.end
            });

            let newEditorState = RichUtils.toggleLink(editorState, newSelection, null);
            newSelection = selection;

            newEditorState = EditorState.acceptSelection(newEditorState, selection);
            onChange(newEditorState);
            onApply();
        };
    }

    render() {
        const contentState = this.props.editorState.getCurrentContent();
        let isUnlink = this.state && this.state.currentEntity && contentState.getEntity(this.state.currentEntity).type === 'LINK';
        return (
            <span>
                <i onClick={this.toggleLink} className='editor-styleButton mdi mdi-link' title='Добавить ссылку'/>
                <i
                    onClick={this.removeLink}
                    className={classNames('editor-styleButton mdi mdi-link-off', {"editor-activeButton": isUnlink})}
                    title='Удалить ссылку'
                />
            </span>
        )
    }
}
