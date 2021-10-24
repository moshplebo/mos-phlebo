import React, { Component } from 'react'
import Store from '../store'
import MediaLibrary from '../toolbox/MediaLibrary.jsx'

export default class ImageSelect extends Component {
    constructor(props) {
        super(props)
        this.state = { imagePreview: this.props.value.src, id: this.props.value.id }

        this.selectFile = this.selectFile.bind(this)
    }

    selectFile() {
        let onFileSelect = (data) => {
            this.setState({ imagePreview: data.src, id: data.id })
            Store.setData({ modal: false, modalData: {} }, true)
        }

        let modalContent = <MediaLibrary key={(+ new Date).toString()} url={this.props.url}
            onSelect={onFileSelect} />

        Store.setData({ modal: true, modalData: { content: modalContent } }, true);
    }

    render() {
        let imagePreview
        if (this.state.imagePreview) {
            imagePreview = <img className="preview-image" src={this.state.imagePreview} />
        }

        return (
            <div>
                {imagePreview}
                <br />
                <button type="button" onClick={this.selectFile}>Выбрать файл</button>
                <input type="hidden" name={this.props.name}
                    value={this.state.id} />
                <hr />
            </div>
        )
    }
}
