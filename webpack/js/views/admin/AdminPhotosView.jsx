import React, {Component} from 'react'
import ReactiveLink from '../../toolbox/ReactiveLink.jsx'
import {Wrapper, Container, Row, Cell} from '../../toolbox/Grid.jsx'
import DeleteLink from '../../components/DeleteLink.jsx'
import Form from '../../toolbox/Form.jsx'
import Input from '../../toolbox/Input.jsx'
import ImageSelect from '../../components/ImageSelect.jsx'

export default class AdminProductsView extends Component {
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
            <div>{content}</div>
        );
    }
}


class New extends Component {
    render() {
        return (
            <PhotosForm formAction={this.props.photos_create_url} method="post" {...this.props} />
        );
    }
}

class Edit extends Component {
    render() {
        return (
            <PhotosForm formAction={this.props.form.control_url} method="put" {...this.props} />
        );
    }
}

class PhotosForm extends Component {
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
        let error;
        if (this.props.error) {
            error = <div style={{width: '600px'}} className="form_common_error"
                         dangerouslySetInnerHTML={{__html: this.props.error}}/>;
        }

        return (
            <Form action={this.props.formAction} method={this.props.method} withFiles={true}>
                {error}
                {this.props.children}

                <h2>Фото</h2>
                <ImageSelect name="photo[media_file_id]" url="/admin/media_library/images"
                             value={this.props.form.preview_image}/>
                <Input label='Альтернативный текст' type='text' value={this.props.form.alt} name='photo[metadata][alt]'/>

                <Input label='Заголовок' type='text' value={this.props.form.header} name='photo[metadata][header]'/>


                <label className="w-input">
                    <span className="label">Описание</span>

                    <textarea
                        className="admin_textarea"
                        value={this.state.value}
                        name="photo[metadata][text]"
                        rows="5"
                        onChange={this.handleChange}
                    />
                </label>

                <div className="admin__float-controls">
                    <input type="submit" value='Сохранить' className="btn btn-primary"/>
                </div>
            </Form>
        )
    }
}
