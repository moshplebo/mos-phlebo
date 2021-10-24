import React, {Component} from 'react'
import classNames from 'classnames'
import Store from '../../store.js'

import ReactiveLink from '../../toolbox/ReactiveLink.jsx'
import {Wrapper, Row, Cell} from '../../toolbox/Grid.jsx'
import Form from '../../toolbox/Form.jsx'
import Input from '../../toolbox/Input.jsx'

import ComponentsBlocks from '../../components/ComponentsBlocks.jsx'
import DeleteLink from '../../components/DeleteLink.jsx'
import DateTimeInput from '../../components/DateTimeInput.jsx'
import ImageSelect from '../../components/ImageSelect.jsx'

export default class AdminArticlesView extends Component {
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
        let articles = [];

        if (this.props.articles.length > 0) {
            articles = this.props.articles.map((element) => {
                return (
                    <tr key={element.name + element.id}>
                        <td>
                            <img className="preview-image--min" src={element.preview_image.src} alt={element.name}/>
                        </td>
                        <td>{element.name}</td>
                        <td>{element.published_at}</td>
                        <td className='center'>
                            <Cell xs='1-2' className='table__controls'>
                                <ReactiveLink href={element.control_url + '/edit'} className='btn btn-primary'>
                                    <i className='mdi mdi-pen'/>
                                </ReactiveLink>
                            </Cell>
                            <Cell xs='1-2' className='table__controls'>
                                <DeleteLink href={element.control_url} className='btn btn-danger'>
                                    <i className='mdi mdi-close'/>
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
                        <th>Фото для анонса</th>
                        <th>Название</th>
                        <th>Дата публикации</th>
                        <th>Управление</th>
                    </tr>
                    </thead>
                    <tbody>
                    {articles}
                    </tbody>
                </table>
            )
        } else {
            content = <p>Статьи не созданы</p>
        }

        return <div>{content}</div>;
    }
}

class New extends Component {
    render() {
        return (
            <ArticlesForm formAction='/admin/articles' method='post' {...this.props} />
        );
    }
}

class Edit extends Component {
    render() {
        return (
            <ArticlesForm formAction={this.props.form.control_url} method='put' {...this.props} />
        );
    }
}

class ArticlesForm extends Component {
    render() {
        let flash;
        if (this.props.error) {
            flash = <div style={{width: '600px'}} className='form_common_error'
                         dangerouslySetInnerHTML={{__html: this.props.error}}/>;
        } else {
            if (this.props.success) {
                flash = <div style={{width: '600px'}} className='form_common_success'
                             dangerouslySetInnerHTML={{__html: this.props.success}}/>;
            }
        }

        let watchBtn;
        let applyBtn;
        let applyInput;
        if (this.props.form.href) {
            watchBtn = <a href={this.props.form.href} target='_blank' className='btn btn-watch'>Посмотреть</a>
            applyBtn = <button className="btn btn-apply" onClick={() => this.apply.value = "true"}>Применить</button>
            applyInput = <input type="hidden" name='apply' value='false' ref={input => this.apply = input}/>
        }

        return (
            <Form action={this.props.formAction} method={this.props.method}>
                {flash}
                {this.props.children}
                <Input label='Название' type='text' value={this.props.form.name} name='article[name]'
                       required="required"/>

                <h2>Мета теги</h2>
                <Input label='URL заголовок' type='text' value={this.props.form.slug} name='article[slug]'/>
                <Input label='title' type='text' value={this.props.form.title} name='article[title]'/>
                <Input label='description' type='text' value={this.props.form.meta_description}
                       name='article[meta_description]'/>
                <Input label='keywords' type='text' value={this.props.form.meta_keywords}
                       name='article[meta_keywords]'/>

                <DateTimeInput label="Дата публикации" name="article[published_at]"
                               defaultValue={this.props.form.published_at}/>

                <h2>Изображение для анонса</h2>
                <ImageSelect name="article[media_file_id]" url="/admin/media_library/images"
                             value={this.props.form.preview_image}/>

                <h2>Содержание</h2>
                <ComponentsBlocks components={this.props.form.components} allowedKinds={this.props.form.allowed_kinds}/>

                <div className="admin__float-controls">
                    <button type='submit' className='btn btn-primary'>Сохранить</button>
                    {applyBtn}
                    {applyInput}
                    {watchBtn}
                </div>
            </Form>
        )
    }
}
