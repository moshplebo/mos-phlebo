import React, {Component} from 'react'
import classNames from 'classnames';
import {Wrapper, Container, Row, Cell} from '../../toolbox/Grid.jsx'
import ReactiveLink from '../../toolbox/ReactiveLink.jsx'
import Hero from '../../toolbox/Hero.jsx'
import Input from '../../toolbox/Input.jsx'
import Checkbox from '../../toolbox/Checkbox.jsx'
import Select from '../../toolbox/Select.jsx'
import Form from '../../toolbox/Form.jsx'
import Store from '../../store.js'

export default class AuthView extends Component {
    render() {
        let block = '';
        switch (this.props.action) {
            case 'login':
                block = <Login {...this.props} />;
                break;
            case 'registration':
                block = <Registration {...this.props} />;
                break;
            case 'recovery':
                block = <Recovery {...this.props} />;
                break;
            case 'reset_password':
                block = <ResetPassword {...this.props} />;
                break;
            default:
                block = <Message {...this.props} />;
        }

        return (
            <Hero className="hero-first">
                {block}
            </Hero>
        );
    }
}

class Message extends Component {
    render() {
        let actions = '';
        if (this.props.actions) {
            let i = 0;
            actions = this.props.actions.map(function (element) {
                i++;
                return (<ReactiveLink key={i} {...element}  />);
            });
        }

        return (
            <div>
                <h1>{this.props.h1}</h1>
                <p className="h1-subheader">{this.props.text}</p>
                {actions}
            </div>
        );
    }
}

class Login extends Component {
    render() {
        let error = '';
        if (this.props.error) {
            error = <div className="form_common_error">{this.props.error}</div>;
        }

        return (
            <Form action="/login" method="post">
                <h2 style={{textAlign: 'left'}}>Вход в личный кабинет</h2>
                {error}
                <input type='hidden' name='redirect_url' value={this.props.form.redirect_url}/>
                <Input type="email" value={this.props.form.login} name="login" label="Электронная почта"
                       required="required"/>
                <Input type="password" value={this.props.form.password} name="password" label="Пароль"
                       required="required"/>

                <Row>
                    <Cell xxs="3-5">
                        <Checkbox name="remember_me" label="Запомнить меня" value="1"
                                  checked={this.props.form.remember_me}/>
                    </Cell>
                    <Cell xxs="2-5" style={{textAlign: 'right'}}>
                        <input type="submit" value='Войти' className="btn btn-primary"/>
                    </Cell>
                </Row>
                <div className="additional_links">
                    <p><ReactiveLink href="/recovery">Забыли пароль? Восстановите его &rarr;</ReactiveLink></p>
                    <p><ReactiveLink href="/registration">Ещё не зарегистрированы?
                        Зарегистрируйтесь &rarr;</ReactiveLink></p>
                </div>
            </Form>
        );
    }
}

class ResetPassword extends Component {
    render() {
        let error = '';
        if (this.props.error) {
            error = <div className="form_common_error">{this.props.error}</div>;
        }

        return (
            <Form action={Store.getData('url')} method="post">
                <h2 style={{textAlign: 'left'}}>Смена пароля</h2>
                {error}
                <Input type="password" value={this.props.form.password} name="password" label="Пароль"
                       required="required"/>
                <Input type="password" value={this.props.form.password_confirmation} name="password_confirmation" label="Подтверждение"
                       required="required"/>

                <Row>
                    <Cell style={{textAlign: 'right'}}>
                        <input type="submit" value='Восстановить' className="btn btn-primary"/>
                    </Cell>
                </Row>

            </Form>
        );
    }
}

class Recovery extends Component {
    render() {
        let error = '';
        if (this.props.error) {
            error = <div className="form_common_error">{this.props.error}</div>;
        }

        return (
            <Form action={Store.getData('url')} method="post">
                <h2 style={{textAlign: 'left'}}>Восстановление пароля</h2>
                {error}
                <Input type="email" value={this.props.form.login} name="login" label="Электронная почта"
                       required="required"/>

                <Row>
                    <Cell style={{textAlign: 'right'}}>
                        <input type="submit" value='Восстановить' className="btn btn-primary"/>
                    </Cell>
                </Row>
                <div className="additional_links">
                    <p><ReactiveLink href="/login">Вы помните свой пароль? Войдите в систему &rarr;</ReactiveLink></p>
                    <p><ReactiveLink href="/registration">Ещё не зарегистрированы?
                        Зарегистрируйтесь &rarr;</ReactiveLink></p>
                </div>
            </Form>
        );
    }
}

class Registration extends Component {

    render() {
        let error = '';
        if (this.props.error) {
            error = <div className="form_common_error">{this.props.error}</div>;
        }

        return (
            <Form action="/registration" method="post">
                <h2 style={{textAlign: 'left'}}>Регистрация</h2>
                {error}

                <Input type="text" value={this.props.form.last_name} name="last_name" label="Фамилия" required="required"/>

                <Input type="text" value={this.props.form.first_name} name="first_name" label="Имя" required="required"/>

                <Input type="email" value={this.props.form.email} name="email" label="Электронная почта" required="required"/>

                <Input type="text"  value={this.props.form.phone} name="phone" label="Телефон" pattern="[0-9\(\)\-\+ ]*"/>

                <Input type="password" value={this.props.form.password} name="password" label="Пароль" required="required"/>

                <Row>
                    <Cell style={{textAlign: 'right'}}>
                        <input type="submit" value='Зарегистрироваться' className="btn btn-primary"/>
                    </Cell>
                </Row>

                <div className="additional_links">
                    <p><ReactiveLink href="/login">Уже зарегистрированы? Войдите в систему &rarr;</ReactiveLink></p>
                    <p><ReactiveLink href="/recovery">Забыли пароль? Восстановите его &rarr;</ReactiveLink></p>
                </div>
            </Form>
        );
    }
}
