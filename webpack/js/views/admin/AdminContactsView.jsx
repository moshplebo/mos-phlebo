import React, {Component} from 'react'

import {Wrapper, Row, Cell} from '../../toolbox/Grid.jsx'
import Form from '../../toolbox/Form.jsx'
import Input from '../../toolbox/Input.jsx'
import Wysiwyg from '../../toolbox/wysiwyg/Wysiwyg.jsx'

export default class AdminContactsView extends Component {
    render() {
        let block = '';
        switch (this.props.action) {
            case 'edit':
                block = <Edit {...this.props} />;
                break;
        }

        return (
            <Wrapper>
                <h1>{this.props.h1}</h1>
                {block}
            </Wrapper>
        );
    }
}

class Edit extends Component {
    render() {
        return (
            <ContactsForm formAction={this.props.form.control_url} method='put' {...this.props} />
        );
    }
}

class ContactsForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            success: this.props.success || '',
            error: this.props.error || '',
            content: this.props.form.content,
            loaded: false
        }

        this.handleChage = this._handleChage.bind(this)
        this.onFocus = this.onFocus.bind(this)
    }

    componentDidMount() {
        this.setState({loaded: true})
    }

    _handleChage(e) {
        if (e.target.value.length > 600) {
            this.setState({ content: e.target.value.substr(0, 600) })
        } else {
            this.setState({ content: e.target.value });
        }

    }

    componentWillReceiveProps(nextProps) {
        this.setState({success: nextProps.success, error: nextProps.error})
    }

    onFocus() {
        this.setState({success: '', error: ''})
    }

    render() {
        let flash;
        if (this.state.error) {
            flash = <div style={{width: '600px'}} className='form_common_error'
                         dangerouslySetInnerHTML={{__html: this.state.error}}/>;
        } else {
            if (this.state.success) {
                flash = <div style={{width: '600px'}} className='form_common_success'
                             dangerouslySetInnerHTML={{__html: this.state.success}}/>;
            }
        }

        return (
            <Form action={this.props.formAction} method={this.props.method}>
                {flash}
                {this.props.children}

                <h2>Ссылки на статьи</h2>
                <Input label='Ваш врач' type='text' value={this.props.form.main_url}
                       name='contact[metadata][main_url]' required="required" onFocus={this.onFocus}/>
                <Input label='Варикозные вены' type='text' value={this.props.form.first_url}
                       name='contact[metadata][first_url]' required="required" onFocus={this.onFocus}/>
                <Input label='Сосудистые звездочки' type='text' value={this.props.form.middle_url}
                       name='contact[metadata][middle_url]' required="required" onFocus={this.onFocus}/>
                <Input label='Лечение осложненных форм' type='text' value={this.props.form.last_url}
                       name='contact[metadata][last_url]' required="required" onFocus={this.onFocus}/>
                <h2>Социальные сети</h2>
                <Input label='Вконтакте' type='text' value={this.props.form.social_vk}
                        name='contact[metadata][social_vk]' onFocus={this.onFocus}/>
                <Input label='Facebook' type='text' value={this.props.form.social_fb}
                        name='contact[metadata][social_fb]' onFocus={this.onFocus}/>
                <Input label='Одноклассники' type='text' value={this.props.form.social_ok}
                        name='contact[metadata][social_ok]' onFocus={this.onFocus}/>
                <Input label='Instagram' type='text' value={this.props.form.social_ig}
                        name='contact[metadata][social_ig]' onFocus={this.onFocus}/>
                <h2>Блок "Ваш врач"</h2>
                <Input label='Заголовок 1' type='text' value={this.props.form.head1}
                       name='contact[metadata][head1]' onFocus={this.onFocus}/>
                <Input label='Заголовок 2' type='text' value={this.props.form.head2}
                       name='contact[metadata][head2]' onFocus={this.onFocus}/>
                <Input label='Заголовок 3' type='text' value={this.props.form.head3}
                       name='contact[metadata][head3]' onFocus={this.onFocus}/>
                <h3>Текст (макс. кол-во символов: 600)</h3>
                Осталось символов: {600 - this.state.content.length}
                <textarea className="admin_textarea" name='contact[metadata][content]' value={this.state.content}
                          required={true} onChange={this.handleChage} rows={5}/>

                <div className="admin__float-controls">
                    <button type='submit' className='btn btn-primary'>Сохранить</button>
                </div>
            </Form>
        )
    }
}
