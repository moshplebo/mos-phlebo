import React, {Component} from 'react'
import ReactiveLink from '../../toolbox/ReactiveLink.jsx'
import {Wrapper, Container, Row, Cell} from '../../toolbox/Grid.jsx'
import DeleteLink from '../../components/DeleteLink.jsx'
import Form from '../../toolbox/Form.jsx'
import Input from '../../toolbox/Input.jsx'

export default class AdminPricesView extends Component {
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
        let prices = [];

        if (this.props.prices && this.props.prices.length > 0) {
            prices = this.props.prices.map((element) => {
                return (
                    <tr key={element.id}>
                        <td>{element.name}</td>
                        <td className="center">{element.cost}</td>
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
                        <th>Название услуги</th>
                        <th>Стоимость</th>
                        <th>Управление</th>
                        <th>Порядок</th>
                    </tr>
                    </thead>
                    <tbody>
                    {prices}
                    </tbody>
                </table>
            )
        } else {
            content = <p>Услуги не найдены</p>
        }

        return (
            <div>{content}</div>
        );
    }
}


class New extends Component {
    render() {
        return (
            <PhotosForm formAction={'/admin/prices'} method="post" {...this.props} />
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

                <Input label='Название услуги' type='text' value={this.props.form.name} name='price[name]'
                       required="required"/>
                <Input label='Цена (значение 0, если услуга бесплатная)' type='number' value={this.props.form.cost} name='price[cost]'
                       defaultValue={0} required="required"/>

                <div className="admin__float-controls">
                    <input type="submit" value='Сохранить' className="btn btn-primary"/>
                </div>
            </Form>
        )
    }
}
