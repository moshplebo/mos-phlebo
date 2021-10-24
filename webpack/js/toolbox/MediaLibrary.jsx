import React, { Component } from 'react'
import classNames from 'classnames';
import Isvg from 'react-inlinesvg';
import Store from '../store.js'
import Superagent from 'superagent'
import { Row, Cell } from './Grid.jsx'
import Form from './Form.jsx'

const MediaStore = {
    needToReturnFile: function () {
        return this.state.onSelect ? true : false
    },

    onSelect: function (data) {
        this.state.onSelect(data)
    },

    urls: function () {
        return this.state.urls
    },

    sendFormPost: function (url, data, method = "post") {
        url = Store.urlNormalize(url);

        Superagent(method, url).set('Accept', 'application/json').send(data).end((err, res) => {
            if (res.ok) {
                let data = JSON.parse(res.text);
                let nextState = data.folder
                nextState['urls'] = data.urls
                this.setState(nextState)
            }
        });
    },

    request: function (url, data, method = "post", update = true) {
        url = Store.urlNormalize(url);

        Superagent(method, url).set('Accept', 'application/json')
            .send({ csrf_token: Store.csrfToken() }).send(data)
            .end((err, res) => {
                if (res.ok) {
                    if (update) {
                        let data = JSON.parse(res.text)
                        let nextState = data.folder
                        nextState['urls'] = data.urls
                        this.setState(nextState)
                    }
                }
            });
    }
}

export default class MediaLibrary extends Component {
    componentWillMount() {
        this.state = { loading: true, onSelect: this.props.onSelect }
        MediaStore.setState = (data) => { this.setState(data) }
    }

    componentDidMount() {
        let state
        Store.getUrlData(this.props.url).then((data) => {
            state = data.folder
            state.urls = data.urls
            state.loading = false
            this.setState(state, () => { MediaStore.state = this.state })
        })
    }

    render() {
        let content
        if (this.state.loading) {
            content = <div className="animate_spin"><i className="mdi mdi-reload" /></div>
        } else {
            content = <MediaFolder {...this.state} />
        }

        return <div>{content}</div>
    }
}

class MediaFolder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newFolderId: this.props.new_folder_id,
            activeId: this.props.new_folder_id,
            activeInfo: '',
            cutted: {}
        }

        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.handleCreateFolderClick = this.handleCreateFolderClick.bind(this);
        this.setActive = this.setActive.bind(this);
        this.setCutted = this.setCutted.bind(this);
        this.paste = this.paste.bind(this);
    }

    handleFileUpload(e) {
        MediaStore.sendFormPost(
            this.props.urls.current,
            new FormData(document.getElementById('media-form'))
        );
    }

    handleCreateFolderClick(e) {
        MediaStore.request(MediaStore.urls()['create_folder'], { path: this.props.path });
    }

    setActive(id, info) {
        this.setState({ activeId: id, activeInfo: info, newFolderId: null })
    }

    setCutted(cutted) {
        this.setState({ cutted: cutted })
    }

    paste() {
        if (this.state.cutted.from == this.props.path) {
            return
        }

        this.setState({ cutted: {} })

        let data = { path: this.props.path, id: this.state.cutted.id }
        if (this.state.cutted.type == 'folder') {
            data.parent_id = this.props.id
        } else {
            data.media_folder_id = this.props.id
        }

        MediaStore.request(MediaStore.urls()['update_' + this.state.cutted.type], data);
    }

    componentWillReceiveProps(nextProps) {
        let nextState = {}

        if (this.props.urls.current != nextProps.urls.current) {
            nextState.activeId = nextProps.new_folder_id
            nextState.activeInfo = null
        }

        if (this.props.new_folder_id != nextProps.new_folder_id) {
            nextState.newFolderId = nextProps.new_folder_id
        } else {
            nextState.newFolderId = null
        }

        this.setState(nextState)
    }

    render() {
        let elements = [];
        if (this.props.folders) {
            this.props.folders.map((folder) => {
                elements.push(
                    <MediaElementFolder key={`folder-${folder.id}`} {...folder} setActive={this.setActive} setCutted={this.setCutted}
                                        active={this.state.activeId == folder.id} parentPath={this.props.path}
                                        isEdited={this.state.newFolderId == folder.id}
                                        cutted={this.state.cutted.id == folder.id && this.state.cutted.type == 'folder'}
                                        key={folder.name + folder.id} />
                )
            })
        }
        if (this.props.files) {
            let FileClass = this.props.trash ? MediaElementFileTrash : MediaElementFile
            this.props.files.map((file) => {
                elements.push(
                    <FileClass key={`file-${file.id}`} {...file} setActive={this.setActive} setCutted={this.setCutted}
                               active={this.state.activeId == file.id} parentPath={this.props.path}
                               cutted={this.state.cutted.id == file.id && this.state.cutted.type == 'file'}
                               key={file.name + file.id} />
                )
            })
        }

        let activeInfo
        if (this.state.activeInfo && this.state.activeInfo.length > 0) {
            activeInfo = <div className="media__active-element-info">{this.state.activeInfo}</div>
        }

        let navbar
        if (!this.props.trash) {
            navbar = <MediaNavbar breadcrumbs={this.props.breadcrumbs}
                                  path={this.props.path}
                                  allowNewFolders={this.props.allow_new_folders}
                                  createFolder={this.handleCreateFolderClick}
                                  cutted={this.state.cutted} paste={this.paste} />
        }

        return (
            <div className="media__folder" onClick={() => this.setActive(null, null)}>
                <Form action={this.props.urls.current} id="media-form" method="post">
                    <input type='file' id='file-uploader' name='media_library[files][]' multiple={true}
                           className='media__file-uploader' onChange={this.handleFileUpload} />

                    {navbar}

                    <div className="media__folder--content clearfix">
                        {elements}
                    </div>
                    {activeInfo}
                </Form>
            </div>
        );
    }
}

class MediaNavbar extends Component {
    render() {
        let breadcrumbs = []
        if (this.props.breadcrumbs) {
            this.props.breadcrumbs.map((element) => {
                breadcrumbs.push(
                    <a key={element.src} href={element.src} className="media__breadcrumbs--item"
                       onClick={(e) => {
                           e.preventDefault();
                           MediaStore.request(element.src, {}, 'get')
                       }}>
                        {element.name}
                    </a>
                )
            })
        }

        let createFolderControl
        if (this.props.allowNewFolders) {
            createFolderControl = (
                <button type="button" className="media__controls--item" title="Создать папку"
                        onClick={this.props.createFolder}>
                    <div className="media__controls--item--content">
                        <Isvg className="media__svg-icon"
                              src={require('../../css/assets/images/icons_media/create_folder.svg')}/>
                    </div>
                </button>
            )
        }

        let pasteControl
        if (this.props.cutted.id) {
            pasteControl = (
                <button type="button" title="Вставить" onClick={this.props.paste}
                        className={classNames("media__controls--item",
                            { disabled: this.props.cutted.from == this.props.path })} >

                    <div className="media__controls--item--content">
                        <i className="mdi mdi-folder-move" />
                    </div>
                </button>
            )
        }

        return (
            <Row className="media__navbar">
                <div className="media__navbar--breadcrumbs">
                    {breadcrumbs}
                </div>
                <div className="media__navbar--controls">
                    <button type="button" className="media__controls--item" title="Загрузить файл"
                            onClick={(e) => {
                                if (e.target != this.fileLabel && !this.fileLabel.contains(e.target)) {
                                    this.fileLabel.dispatchEvent(new MouseEvent("click"))
                                }
                            }} >
                        <label htmlFor="file-uploader" className="media__controls--item--content"
                               ref={(label) => { this.fileLabel = label }} >
                            <Isvg className="media__svg-icon"
                                  src={require('../../css/assets/images/icons_media/download.svg')}/>
                        </label>
                    </button>
                    {createFolderControl}
                    {pasteControl}
                </div>
            </Row>
        );
    }
}


class MediaElement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isEdited: this.props.isEdited
        }

        this.handleClick = this.handleClick.bind(this);
        this.rename = this.rename.bind(this);
        this.completeRename = this.completeRename.bind(this);
        this.isAvailable = this.isAvailable.bind(this);
        this.delete = this.delete.bind(this);
        this.cut = this.cut.bind(this);
    }

    isAvailable() {
        return (this.props.active && !this.state.isEdited && !this.props.cutted)
    }

    handleClick(e) {
        e.stopPropagation()
        this.props.setActive(this.props.id, this.props.info)
    }

    rename(e) {
        this.setState({ isEdited: true })
    }

    completeRename(newName) {
        this.setState({ isEdited: false })

        if (newName != this.props.name) {
            MediaStore.request(MediaStore.urls()['update_' + this.type()], {
                path: this.props.parentPath,
                id: this.props.id,
                name: newName
            })
        }
    }

    delete() {
        this.props.setActive(null, null)
    }

    cut() {
        this.props.setCutted({
            id: this.props.id,
            name: this.props.name,
            from: this.props.parentPath,
            type: this.type()
        })
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ isEdited: nextProps.isEdited })
    }

    controls() {
        if (!this.props.active || this.state.isEdited) {
            return
        }

        let controls
        if (this.props.cutted) {
            return (
                <div className="media__element__controls">
                    <MediaElementControl title="Отмена" icon="close" className="full-width"
                                         onClick={() => this.props.setCutted({})} />
                </div>
            )
        }

        return (
            <div className="media__element__controls">
                <MediaElementControl title="Переименовать" icon="pen" onClick={this.rename} />
                <MediaElementControl title="Вырезать" icon="content-cut" onClick={this.cut} />
                <MediaElementControl title="Удалить" icon="delete" onClick={this.delete}
                                     disabled={this.props.delete_status == 'disabled'}
                                     className={this.props.delete_status} />
            </div>
        )
    }

    render() {
        let name;
        if (this.state.isEdited) {
            name = <MediaElementNameInput name={this.props.name} complete={this.completeRename} />
        } else {
            name = <span className="media__element__name">{this.props.name}</span>
        }

        return (
            <div onClick={this.handleClick}
                 className={classNames("media__element", {
                     "active": this.props.active,
                     "cutted": this.props.cutted,
                     'to-delete': this.state.toDelete
                 })} >
                <div className="media__element__view__container">
                    {this.view()}
                    {this.controls()}
                </div>
                {name}
            </div>
        )
    }
}

class MediaElementFolder extends MediaElement {
    type() { return "folder" }

    handleClick(e) {
        super.handleClick(e)

        if (this.isAvailable()) {
            MediaStore.request(this.props.src, {}, 'get')
        }
    }

    delete() {
        super.delete()
        MediaStore.request(MediaStore.urls()['delete_folder'], {
            path: this.props.parentPath,
            id: this.props.id
        }, 'delete')
    }

    view() {
        return (
            <div className="media__element__view media__element__view--folder">
                <Isvg className="media__svg-icon" src={require('../../css/assets/images/icons_media/folder.svg')}/>
            </div>
        )
    }
}

class MediaElementFile extends MediaElement {
    type() { return "file" }

    handleClick(e) {
        super.handleClick(e)

        if (this.isAvailable()) {
            if (MediaStore.needToReturnFile()) {
                MediaStore.onSelect({ id: this.props.id, src: this.props.src })
            } else {
                window.open(this.props.src, '_blank')
            }
        }
    }

    delete() {
        setTimeout(() => super.delete(), 1)

        let sendDelete = (update = true) => {
            MediaStore.request(MediaStore.urls()['delete_file'], {
                path: this.props.parentPath,
                id: this.props.id
            }, 'delete', update)
            this.setState({ deleteTimeout: null })
        }

        const deleteTimeout = setTimeout(sendDelete, 3000)

        this.setState({
            toDelete: true,
            deleteTimeout: { id: deleteTimeout, callback: sendDelete }
        })

        Store.addDialog((
            <div>
                <span className="dialog-text">Файл перемещён в корзину</span>
                <button className="dialog__cancel-delete"
                        onClick={() => {
                            window.clearTimeout(deleteTimeout);
                            this.setState({ toDelete: false, deleteTimeout: null })
                        }}>
                    Отмена
                </button>
            </div>
        ), 3000)
    }

    componentWillUnmount() {
        if (this.state.deleteTimeout) {
            this.state.deleteTimeout.callback(false)
            window.clearTimeout(this.state.deleteTimeout.id)
            Store.clearDialogs()
        }
    }

    view() {
        let view
        switch (this.props.type) {
            case 'MediaImage':
                view = <img src={this.props.src} alt={this.props.name}
                            className="media__element__view media__element__view--image" />
                break;

            default:
                view = (
                    <div className="media__element__view media__element__view--folder">
                        <i className="mdi mdi-file" />
                    </div>
                )
                break;
        }

        return (
            <div>
                {view}
            </div>
        )
    }
}

class MediaElementFileTrash extends MediaElementFile {
    constructor(props) {
        super(props);

        this.restore = this.restore.bind(this)
        this.destroy = this.destroy.bind(this)
    }

    restore() {
        MediaStore.request(MediaStore.urls()['restore_file'], { id: this.props.id })
    }

    destroy() {
        MediaStore.request(MediaStore.urls()['destroy_file'], { id: this.props.id }, 'delete')
    }

    controls() {
        return (
            <div className="media__element__controls">
                <MediaElementControl className="half-width" title="Восстановить" icon="restore"
                                     onClick={this.restore} />
                <MediaElementControl className="half-width" title="Удалить" icon="delete-forever"
                                     onClick={this.destroy} />
            </div>
        )
    }
}

class MediaElementControl extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        e.stopPropagation();

        if (this.props.disabled) {
            return;
        }

        this.props.onClick(e)
    }

    render() {
        return (
            <button title={this.props.title} type="button" onClick={this.handleClick}
                    className={"media__element__controls--item " + this.props.className}>

                <i className={"mdi mdi-" + this.props.icon}></i>
            </button>
        )
    }
}

class MediaElementNameInput extends Component {
    constructor(props) {
        super(props);

        this.state = { name: this.props.name }
        this.handleBlur = this.handleBlur.bind(this);
        this.handleEnterPress = this.handleEnterPress.bind(this);
    }

    handleBlur(e) {
        this.props.complete(this.state.name)
    }

    handleEnterPress(e) {
        if (e.keyCode == 13) {
            e.preventDefault()
            this.props.complete(this.state.name)
        }
    }

    componentDidMount() {
        this.nameInput.focus()
    }

    render() {
        return (
            <input type="text" className="media__element__name is_edited" value={this.state.name} maxLength="40"
                   onBlur={this.handleBlur} onKeyDown={this.handleEnterPress}
                   onChange={(e) => { this.setState({ name: e.target.value }) }}
                   ref={(input) => { this.nameInput = input; }} />
        )
    }
}
