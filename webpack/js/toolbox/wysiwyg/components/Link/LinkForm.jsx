import React, {Component} from 'react'
import classNames from 'classnames'
import Store from '../../../../store.js'

export default class LinkForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title || '',
            url: this.props.url || '',
            target: this.props.target || '_self'
        }
        this.handleUrlChange = (e) => this.setState({url: e.target.value});
        this.handleTextChange = (e) => this.setState({title: e.target.value});
        this.handleTargetChange = () => this.setState({target: this.state.target == '_self' ? '_blank' : '_self'});
        this.handleApply = this._handleApply.bind(this);
        this.handleDelete = this._handleDelete.bind(this);
        this.handleKeyPress = this._handleKeyPress.bind(this);
    }

    _handleKeyPress(e) {
        if (e.keyCode == 27) {
            this._closeForm();
            this.props.onApply();
        }
    }

    _closeForm() {
        Store.setData({
            modal: false,
            modalData: {}
        }, true);
    }

    _handleApply(e) {
        e.preventDefault();
        this._closeForm();
        this.props.onConfirmLink(this.state);
    }

    _handleDelete(e) {
        e.preventDefault();
        let res = Object.assign({}, this.state, {linkRemove: true});
        this._closeForm();
        this.props.onConfirmLink(res);
    }

    componentDidMount() {
        setTimeout(() => {
            this.refs.url.focus();
            window.addEventListener('keyPress', this.handleKeyPress);
        }, 0)
    }

    componentWillUnmount() {
        window.removeEventListener('keyPress', this.handleKeyPress);
    }

    render() {
        let removeLinkBtn;
        if (this.props.currentEntity) {
            removeLinkBtn = (
                <button className='btn btn-danger' onClick={this.handleDelete}>Удалить ссылку</button>
            )
        }

        return (
            <div onKeyDown={this.handleKeyPress} className="editor__link-prompt">
                <div style={{marginBottom: '10px'}}>
                    <legend className="label">Ссылка</legend>
                    <input ref='url' type='text' onChange={this.handleUrlChange} name='url' value={this.state.url}/>
                </div>
                <div style={{marginBottom: '10px'}}>
                    <legend className="label">Текст</legend>
                    <input type='text' onChange={this.handleTextChange} name='text' value={this.state.title}/>
                </div>
                <div style={{marginBottom: '10px'}}>
                    <span className="label">Открывать в новом окне</span>
                    <input type='checkbox' onChange={this.handleTargetChange} checked={this.state.target == '_blank'}/>
                </div>
                <button className='btn btn-primary' onClick={this.handleApply} disabled={this.state.url.length == 0}>Применить</button>
                {removeLinkBtn}
            </div>
        );
    }
}
