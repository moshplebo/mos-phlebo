import React, {Component} from 'react'
import classNames from 'classnames'
import Store from '../../store.js'
import ReactiveLink from '../../toolbox/ReactiveLink.jsx'
import {Wrapper, Container, Row, Cell} from '../../toolbox/Grid.jsx'
import DeleteLink from '../../components/DeleteLink.jsx'
import Form from '../../toolbox/Form.jsx'
import Input from '../../toolbox/Input.jsx'
import Checkbox from '../../toolbox/Checkbox.jsx'
import ComponentsBlocks from '../../components/ComponentsBlocks.jsx'
import Select from '../../toolbox/Select.jsx'

export default class AdminStaticPagesView extends Component {
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
        let static_pages = [];

        if (this.props.static_pages.length > 0) {
            static_pages = this.props.static_pages.map((element) => {
                let minus = ""
                let position = <td/>

                if (element.depth > 0) {
                    minus = <code>&nbsp;&nbsp;</code>;
                    position =
                        <td className='center'>
                            <Cell xs='1-2' className='table__controls'>
                                <ReactiveLink href={element.control_url + '/move_up'} className='' post_link='true'>
                                    <i className='mdi mdi-arrow-up-bold' />
                                </ReactiveLink>
                            </Cell>
                            <Cell xs='1-2' className='table__controls'>
                                <ReactiveLink href={element.control_url + '/move_down'} className='' post_link='true'>
                                    <i className='mdi mdi-arrow-down-bold' />
                                </ReactiveLink>
                            </Cell>
                        </td>
                }
                return (
                    <tr key={element.id}>
                        <td>{minus}{element.name}</td>
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
                        {position}
                    </tr>
                )
            });

            content = (
                <table className='admin-table'>
                    <thead>
                    <tr>
                        <th style={{textAlign: "left"}}>Название</th>
                        <th>Управление</th>
                        <th>Порядок</th>
                    </tr>
                    </thead>
                    <tbody>
                    {static_pages}
                    </tbody>
                </table>
            )
        } else {
            content = <p>Статичные страницы не созданы</p>
        }

        return (
            <div>
                {content}
            </div>
        );
    }
}

class New extends Component {
    render() {
        return (
            <StaticPagesForm formAction='/admin/static_pages' method='post' {...this.props} />
        );
    }
}

class Edit extends Component {
    render() {
        return (
            <StaticPagesForm formAction={this.props.form.control_url} method='put' {...this.props} />
        );
    }
}

class StaticPagesForm extends Component {
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
                <Input label='Название' type='text' value={this.props.form.name} name='static_page[name]'
                       required="required" updatable={true}/>

                <h2>Мета теги</h2>
                <Input label='URL заголовок' type='text' value={this.props.form.slug} name='static_page[slug]' updatable={true}/>
                <Input label='title' type='text' value={this.props.form.title} name='static_page[title]' updatable={true}/>
                <Input label='description' type='text' value={this.props.form.meta_description}
                       name='static_page[meta_description]' updatable={true}/>
                <Input label='keywords' type='text' value={this.props.form.meta_keywords}  updatable={true}
                       name='static_page[meta_keywords]'/>

                <Checkbox name="static_page[active]" label="Активна" value="1" checked={this.props.form.active}/>

                <Select options={this.props.form.parents} name="static_page[parent_id]"
                        selected={this.props.form.parent_id} label="Родительская страница"/>

                <Childs static_pages={this.props.form.childs}/>

                <h2>Компоненты</h2>
                <ComponentsBlocks components={this.props.form.components} allowedKinds={this.props.form.allowed_kinds}/>

                <div className="admin__float-controls">
                    <button type='submit' className='btn btn-primary'>
                        Сохранить
                    </button>
                    {applyBtn}
                    {applyInput}
                    {watchBtn}
                </div>
            </Form>
        )
    }
}

class Childs extends Component {
    render() {
        let content = '';
        let static_pages = [];

        if (this.props.static_pages.length > 0) {
            static_pages = this.props.static_pages.map((element) => {
                return (
                    <tr key={element.id}>
                        <td>{element.name}</td>
                        <td className='center'>
                            <Cell xs='1-2' className='table__controls'>
                                <ReactiveLink href={'/admin/static_pages/' + element.id + '/edit'}
                                              className='btn btn-primary'>
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
                <div>
                    <h2>Вложенные статичные страницы</h2>
                    <table className='admin-table'>
                        <thead>
                        <tr>
                            <th>Название</th>
                            <th>Управление</th>
                        </tr>
                        </thead>
                        <tbody>
                        {static_pages}
                        </tbody>
                    </table>
                </div>
            )
        }

        return (
            <div>
                {content}
            </div>
        );
    }
}
