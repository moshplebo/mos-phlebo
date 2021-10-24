import React, { Component } from 'react'
import classNames from 'classnames'
import { Wrapper, Container, Row, Cell } from '../toolbox/Grid.jsx'
import Select from '../toolbox/Select.jsx'
import Wysiwyg from '../toolbox/wysiwyg/Wysiwyg.jsx'
import Counter from '../toolbox/Counter.jsx'
import MediaLibrary from '../toolbox/MediaLibrary.jsx'
import Input from '../toolbox/Input.jsx'
import Store from '../store.js'
import Superagent from 'superagent'

export default class ComponentsBlocks extends Component {
    constructor(props) {
        super(props)

        this.state = { components: this.props.components }

        this.handleClick = this._handleClick.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ components: nextProps.components })
    }

    _handleClick(e) {
        e.preventDefault()
        let components = this.state.components
        let position = components.length + 1
        let id = (+new Date).toString()
        components.push({
            id: id,
            position: position,
            input_name: `components[${id}]`,
            content: '',
            images: [],
            newRecord: true
        })

        this.setState({ components: components })
    }

    components() {
        let components = []
        if (this.state.components && this.state.components.length > 0) {
            components = this.state.components.map((component) => {
                return (
                    <ComponentWrapper key={component.id} {...component} allowedKinds={this.props.allowedKinds} />
                )
            })
        }

        return components
    }

    render() {
        return (
            <div>
                {this.components()}
                <div className='blocks-control'>
                    <button className='btn-add' type='button' onClick={this.handleClick}>+ Добавить компонент</button>
                </div>
            </div>
        )
    }
}

class ComponentWrapper extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isPositionChanged: false,
            isDeleted: false
        }

        this.handleChage = (v) => {
            this.setState({ isPositionChanged: v !== this.props.position, pos: v })
        }
        this.removeComponent = this._removeComponent.bind(this)
    }

    _removeComponent(e) {
        e.preventDefault()
        this.setState({ isDeleted: true })
    }

    render() {
        let posName
        if (this.state.isPositionChanged || this.props.newRecord) {
            posName = `${this.props.input_name}[position]`
        }

        let isDeleted = {}
        let markedForDestuction
        if (this.state.isDeleted) {
            isDeleted = { display: 'none' }
            markedForDestuction = (
                <input type='hidden' name={`${this.props.input_name}[_marked_for_destruction]`} value='1' />
            )
        }

        return (
            <div className='component_wrapper'>
                <div style={isDeleted}>
                    <div className='component_block'>
                        <ComponentBlock key={this.props.id} {...this.props} />
                    </div>

                    <div className='component_counter-wrapper'>
                        <p className='component_counter-title'>Позиция</p>
                        <Counter name={posName} onChange={this.handleChage} minValue={1}
                            value={this.state.pos || this.props.position} className='component_counter' />
                    </div>

                    <button type='button' className='remove-component' onClick={this.removeComponent}>Удалить
                                                                                                      компонент &times;</button>
                </div>
                {markedForDestuction}
            </div>
        )
    }
}

class ComponentBlock extends Component {
    constructor(props) {
        super(props)

        this.state = { kind: this.props.kind || '' }
        this.handleChange = this._handleChange.bind(this)
    }

    _handleChange(name, key) {
        this.setState({ kind: key }, () => {
            this.kindInput.value = key
        })
    }

    componentDidMount() {
        this.kindInput.value = this.state.kind
    }

    render() {
        let block
        switch (this.state.kind) {
            case 'wysiwyg_block':
                block =
                    <WysiwygBlock name={`${this.props.input_name}[metadata][content]`} content={this.props.content} />
                break
            case 'gallery_block':
                block = <GalleryBlock name={`${this.props.input_name}[media_file_ids][]`} {...this.props} />
                break
            case 'wrapper_block':
                block = <WrapperBlock name={this.props.input_name} {...this.props} />
                break
            case 'youtube_block':
                block = <YoutubeBlock lable={this.props.lable} href={this.props.youtube} name={`${this.props.input_name}[metadata][youtube]`}/>
                break
            default:
                block =
                    <Select options={this.props.allowedKinds} label='Выберите тип блока' onChange={this.handleChange} />
                break
        }

        return (
            <div>
                {block}
                <input type='hidden' name={`${this.props.input_name}[kind]`} ref={kind => this.kindInput = kind} />
            </div>
        )
    }
}

class GalleryBlock extends Component {
    constructor(props) {
        super(props)

        this.state = { images: this.props.images }

        this.addImage = this.addImage.bind(this)
    }

    addImage(e) {
        e.preventDefault()

        let images = this.state.images
        images.push({ src: undefined, alt: undefined })
        this.setState({ images: images })
    }

    removeImage(e, index) {
        e.preventDefault()

        let images = this.state.images
        images.splice(index, 1)
        this.setState({ images: images })
    }

    images() {
        let images = []

        images = this.state.images.map((image, index) => {
            return (
                <GalleryImage key={`gallery-image-${index}`} index={index}
                    handleRemove={(e, i) => this.removeImage(e, i)} fieldName={this.props.name} {...image} />
            )
        })

        return images
    }

    render() {
        return (
            <div className='components_element'>
                <h3>Галерея изображений</h3>
                <p>Рекомендуемая минимальная высота изображений - 300px</p>
                <input type='hidden' name={this.props.name} />
                {this.images()}
                <button className='btn-add' onClick={this.addImage}>+</button>
            </div>
        )
    }
}

class GalleryImage extends Component {
    constructor(props) {
        super(props)

        this.state = { src: this.props.src, alt: this.props.name }

        this.selectFile = this.selectFile.bind(this)
        this.removeFile = this.removeFile.bind(this)
    }

    componentDidMount() {
        if (this.props.id) {
            this.fileInput.value = this.props.id
        }
    }

    selectFile() {
        let onFileSelect = (data) => {
            this.fileInput.value = data.id
            this.setState({ src: data.src, alt: data.name })
            Store.setData({ modal: false, modalData: {} }, true)
        }

        let modalContent = <MediaLibrary key={(+new Date).toString()} url='/admin/media_library/images'
            onSelect={onFileSelect} />

        Store.setData({ modal: true, modalData: { content: modalContent } }, true)
    }

    removeFile(e) {
        e.preventDefault()
        this.props.handleRemove(e, this.props.index)
    }

    render() {
        let preview
        if (this.state.src) {
            preview = <img className='gallery_preview' src={this.state.src} alt={this.state.alt} />
        }

        return (
            <Row>
                <Cell xxs='7-8'>
                    <div>
                        <br />
                        {preview}
                        <br />
                        <input type='hidden' name={this.props.fieldName}
                            ref={fileInput => this.fileInput = fileInput} />
                        <button type='button' className='btn' onClick={this.selectFile}>Выбрать файл</button>
                        <hr />
                    </div>
                </Cell>
                <Cell xxs='1-8' className='remove__button__wrapper remove__button__wrapper--low '>
                    <button type='button' onClick={this.removeFile}>&times;</button>
                </Cell>
            </Row>
        )
    }
}

class WysiwygBlock extends Component {
    constructor(props) {
        super(props)

        this.state = { loaded: false, content: this.props.content }

        this.handleChage = this._handleChage.bind(this)
    }

    _handleChage(newContent) {
        this.setState({ content: newContent })
    }

    componentDidMount() {
        this.setState({ loaded: true })
    }

    render() {
        const hiddenArea = {
            width: 0,
            height: 0,
            position: 'absolute',
            left: -999999
        }

        return (
            <div className='components_element'>
                <h3>Текстовый блок</h3>
                {this.state.loaded ? <Wysiwyg onChange={this.handleChage} content={this.state.content} /> : null}
                <textarea name={this.props.name} value={this.state.content} readOnly={true} style={hiddenArea} />
            </div>
        )
    }
}

class WrapperBlock extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loaded: false,
            content: this.props.content,
            src: '',
            float: this.props.float || 'left'
        }

        this.selectFile = this.selectFile.bind(this)
        this.handleChange = this._handleChange.bind(this)
        this.handleClick = this._handleClick.bind(this)
    }

    _handleChange(newContent) {
        this.setState({ content: newContent })
    }

    _handleClick(e) {
        this.floatInput.value = e.target.value
        this.setState({ float: e.target.value })
    }

    componentDidMount() {
        this.setState({ loaded: true })
        if (this.props.images && this.props.images[0]) {
            this.setState({ src: this.props.images[0].src })
            this.fileInput.value = this.props.images[0].id
        }
    }

    selectFile() {
        let onFileSelect = (data) => {
            this.fileInput.value = data.id
            this.setState({ src: data.src })
            Store.setData({ modal: false, modalData: {} }, true)
        }

        let modalContent = <MediaLibrary key={(+new Date).toString()} url='/admin/media_library/images'
            onSelect={onFileSelect} />

        Store.setData({ modal: true, modalData: { content: modalContent } }, true)
    }

    render() {
        let preview
        if (this.state.src) {
            preview = <img className="gallery_preview" src={this.state.src} />
        }

        const hiddenArea = {
            width: 0,
            height: 0,
            position: 'absolute',
            left: -999999
        }

        return (
            <div className='components_element'>
                <h3>Блок с обтеканием текста</h3>

                {/*<Row>*/}
                {/*<Cell sm="1-8">*/}
                {/*<label className={classNames("w-checkbox")}>*/}
                {/*<input className={classNames("i-radio")} type='radio'*/}
                {/*name='float_pos'*/}
                {/*value="left"*/}
                {/*onChange={this.handleClick}*/}
                {/*checked={this.state.float == 'left' ? true : false}*/}
                {/*/>*/}
                {/*<span className="label">Слева</span>*/}
                {/*</label>*/}
                {/*</Cell>*/}

                {/*<Cell sm="1-8">*/}
                {/*<label className={classNames("w-checkbox")}>*/}
                {/*<input className={classNames("i-radio")} type='radio'*/}
                {/*name='float_pos'*/}
                {/*value="right"*/}
                {/*onChange={this.handleClick}*/}
                {/*checked={this.state.float == 'right' ? true : false}*/}
                {/*/>*/}
                {/*<span className="label">Справа</span>*/}
                {/*</label>*/}
                {/*</Cell>*/}
                {/*</Row>*/}
                <input type='hidden' name={`${this.props.name}[metadata][float]`}
                    ref={floatInput => this.floatInput = floatInput} />

                <div>
                    <br />
                    {preview}
                    <br />
                    <input type='hidden' name={`${this.props.name}[media_file_ids][]`}
                        ref={fileInput => this.fileInput = fileInput} />
                    <button type='button' className='btn' onClick={this.selectFile}>Выбрать файл</button>
                    <hr />
                </div>

                {this.state.loaded ? <Wysiwyg images={false} onChange={this.handleChange}
                    content={this.state.content} /> : null}
                <textarea name={`${this.props.name}[metadata][content]`} value={this.state.content} readOnly={true}
                    style={hiddenArea} />
            </div>
        )
    }
}

class YoutubeBlock extends Component { 
    constructor(props){
        super(props);
        
    }
    render() {
        return (
            <div className='components_element'>
                <h3>YouTube-видео</h3>                
                <Input label="Ссылка на YouTube-видео" value={this.props.href} name={this.props.name} required="true"/>
            </div>
        )
    }
}
