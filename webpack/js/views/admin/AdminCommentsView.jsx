import React, { Component } from 'react'
import classNames from 'classnames'
import Store from '../../store.js'

import ReactiveLink from '../../toolbox/ReactiveLink.jsx'
import { Wrapper, Row, Cell } from '../../toolbox/Grid.jsx'
import Form from '../../toolbox/Form.jsx'
import Input from '../../toolbox/Input.jsx'
import DateTimeInput from '../../components/DateTimeInput.jsx'
import ImageSelect from '../../components/ImageSelect.jsx'

import ComponentsBlocks from '../../components/ComponentsBlocks.jsx'
import DeleteLink from '../../components/DeleteLink.jsx'

export default class AdminCommentsView extends Component {
    render() {
        let block = '';
        switch (this.props.action) {
            case 'index':
                block = <Index {...this.props} />;
                break;
            case 'new':
                block = <New {...this.props} />;
                break;
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

class Index extends Component {
    render() {
        let content = '';
        let comments = [];

        if (this.props.comments.length > 0) {
            comments = this.props.comments.map((element) => {
                return (
                    <tr key={element.id}>
                        <td>{element.fio}</td>
                        <td>{element.date}</td>
                        <td className='center'>
                            <Cell xs='1-2' className='table__controls'>
                                <ReactiveLink href={element.control_url + '/edit'} className='btn btn-primary'>
                                    <i className='mdi mdi-pen' />
                                </ReactiveLink>
                            </Cell>
                            <Cell xs='1-2' className='table__controls'>
                                <DeleteLink href={element.control_url} className='btn btn-danger'>
                                    <i className='mdi mdi-close' />
                                </DeleteLink>
                            </Cell>
                        </td>
                    </tr>
                )
            })

            content = (
                <table className='admin-table'>
                    <thead>
                    <tr>
                        <th>Название</th>
                        <th>Дата</th>
                        <th>Управление</th>
                    </tr>
                    </thead>
                    <tbody>
                    {comments}
                    </tbody>
                </table>
            )
        } else {
            content = <p>Отзывы не найдены</p>
        }

        return <div>{content}</div>;
    }
}

class New extends Component {
    render() {
        return (
            <CommentsForm formAction='/admin/comments' method='post' {...this.props} />
        );
    }
}

class Edit extends Component {
    render() {
        return (
            <CommentsForm formAction={this.props.form.control_url} method='put' {...this.props} />
        );
    }
}

class CommentsForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.form.text || ""
        };

        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(e) {
        this.setState({value: e.target.value})
    }

    render() {
        let error
        if (this.props.error) {
            error = <div style={{ width: '600px' }} className='form_common_error' dangerouslySetInnerHTML={{ __html: this.props.error }} />;
        }

        return (
            <Form action={this.props.formAction} method={this.props.method}>
                {error}
                {this.props.children}
                <Input label='ФИО автора отзыва' type='text' value={this.props.form.fio} name='comment[fio]' required="required"/>

                <h2>Изображение</h2>
                <ImageSelect name="comment[media_file_id]" url="/admin/media_library/images"
                             value={this.props.form.preview_image} />

                <label className="register-form__label">Дата публикации
                    <DateTimeInput name="comment[date]" defaultValue={this.props.form.date}/>
                </label>

                <label className="w-input">
                    <span className="label">Содержание</span>

                    <textarea
                        className="admin_textarea"
                        value={this.state.value}
                        name="comment[text]"
                        rows="5"
                        onChange={this.handleChange}
                    />
                </label>

                <div className="admin__float-controls">
                    <button type='submit' className='btn btn-primary'>Сохранить</button>
                </div>
            </Form>
        )
    }
}
