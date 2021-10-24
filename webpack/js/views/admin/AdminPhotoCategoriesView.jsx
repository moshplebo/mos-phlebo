import React, {Component} from 'react'
import ReactiveLink from '../../toolbox/ReactiveLink.jsx'
import {Wrapper, Container, Row, Cell} from '../../toolbox/Grid.jsx'
import DeleteLink from '../../components/DeleteLink.jsx'
import Form from '../../toolbox/Form.jsx'
import Input from '../../toolbox/Input.jsx'

export default class AdminPhotoCategoriesView extends Component {
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
        let categories = [];

        if (this.props.categories && this.props.categories.length > 0) {
            categories = this.props.categories.map((element) => {
                return (
                    <tr key={element.id}>
                        <td>
                            <a href={element.control_url} className="admin-link">
                                {element.name}
                            </a>
                        </td>
                        <td className="center">
                            <Cell xs="1-2" className="table__controls">
                                <ReactiveLink href={element.control_url + "/edit"} className="btn btn-primary">
                                    <i className="mdi mdi-pen"/>
                                </ReactiveLink>
                            </Cell>
                            <Cell xs="1-2" className="table__controls">
                                <DeleteLink href={element.control_url} className="btn btn-danger">
                                    <i className="mdi mdi-close"/>
                                </DeleteLink>
                            </Cell>
                        </td>
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
                    </tr>
                )
            });

            content = (
                <table className="admin-table">
                    <thead>
                    <tr>
                        <th>Название категории</th>
                        <th>Управление</th>
                        <th>Порядок</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories}
                    </tbody>
                </table>
            )
        } else {
            content = <p>Категории не найдены</p>
        }

        return (
            <div>{content}</div>
        );
    }
}

class New extends Component {
    render() {
        return (
            <PhotosForm formAction="/admin/photo_categories" method="post" {...this.props} />
        );
    }
}

class Edit extends Component {
    render() {
        let content = '';
        let photos = [];

        if (this.props.photos && this.props.photos.length > 0) {
            photos = this.props.photos.map((element) => {
                return (
                    <tr key={element.id}>
                        <td>
                            <img className="preview-image--min" src={element.img}/>
                        </td>
                        <td className="center ">
                            <Cell xs="1-2" className="table__controls">
                                <ReactiveLink href={element.control_url + "/edit"} className="btn btn-primary">
                                    <i className="mdi mdi-pen"/>
                                </ReactiveLink>
                            </Cell>
                            <Cell xs="1-2" className="table__controls">
                                <DeleteLink href={element.control_url} className="btn btn-danger">
                                    <i className="mdi mdi-close"/>
                                </DeleteLink>
                            </Cell>
                        </td>
                    </tr>
                )
            });

            content = (
                <table className="admin-table">
                    <thead>
                    <tr>
                        <th>Изображение</th>
                        <th>Управление</th>
                    </tr>
                    </thead>
                    <tbody>
                    {photos}
                    </tbody>
                </table>
            )
        } else {
            content = <p>Фотографии не найдены</p>
        }

        return (
            <div>
                <PhotosForm formAction={this.props.form.control_url} method="put" {...this.props} />
                {content}
            </div>
        );
    }
}

class PhotosForm extends Component {
    render() {
        let error;
        if (this.props.error) {
            error = <div style={{width: '600px'}} className="form_common_error"
                         dangerouslySetInnerHTML={{__html: this.props.error}}/>;
        }

        return (
            <Form action={this.props.formAction} method={this.props.method}>
                {error}
                {this.props.children}

                <Input label='Название' type='text' value={this.props.form.name} name='photo_category[name]'/>

                <div className="admin__float-controls">
                    <input type="submit" value='Сохранить' className="btn btn-primary"/>
                </div>
            </Form>
        )
    }
}
