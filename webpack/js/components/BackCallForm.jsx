import React, {Component} from 'react'
import {Wrapper, Container, Row, Cell} from '../toolbox/Grid.jsx'
import Store from '../store.js'
import Form from '../toolbox/Form.jsx'
import Input from '../toolbox/Input.jsx'
import Datetime from 'react-datetime'
import classNames from 'classnames';

import TimePicker from 'react-times';
import 'react-times/css/material/default.css';
import 'react-times/css/classic/default.css';

export default class BackCallForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            date: this.props.cur_date || "",
            time: this.props.cur_time || "",
            backDate: this.props.cur_date || "",
            backTime: this.props.cur_time || "",
            checked: "1"
        };

        this.closeModal = this.closeModal.bind(this);
        this.setDate = this.setDate.bind(this);
        this.onTimeChange = this.onTimeChange.bind(this);
        this.setBackDate = this.setBackDate.bind(this);
        this.onBackTimeChange = this.onBackTimeChange.bind(this);
        this.onChecked = this.onChecked.bind(this);
        this.dateValidate = this.dateValidate.bind(this);
    }

    closeModal() {
        Store.setData({modal: false, modalClose: false}, true);
    }

    setBackDate(newDate) {
        let date = new Date(newDate);
        let year = "" + date.getFullYear();
        let month = "" + (date.getMonth() + 1);
        if (month.length == 1) {
            month = "0" + month;
        }
        let day = "" + date.getDate();
        if (day.length == 1) {
            day = "0" + day;
        }
        this.setState({backDate: day + "." + month + "." + year + " "});
    }

    setDate(newDate) {
        let date = new Date(newDate);
        let year = "" + date.getFullYear();
        let month = "" + (date.getMonth() + 1);
        if (month.length == 1) {
            month = "0" + month;
        }
        let day = "" + date.getDate();
        if (day.length == 1) {
            day = "0" + day;
        }
        this.setState({date: day + "." + month + "." + year + " "});
    };

    onChecked(value) {
        this.setState({checked: value});
    };

    onTimeChange(time) {
        this.setState({time: time});
    }

    onBackTimeChange(time) {
        this.setState({backTime: time});
    }

    dateValidate(curDate) {
        let yesterday = Datetime.moment().subtract(1, 'day');
        return curDate.isAfter(yesterday);
    };

    render() {
        let back_datetimepicker;
        if (this.state.checked !== "1") {
            back_datetimepicker =
                <Row>
                    <Cell sm="1-2" className="register-form__date">
                        <Input value={this.state.backDate} type="text" readOnly="readOnly"
                               name="register[back_call_date]" className="register-form__date-input"
                               required="required" updatable/>
                        <input value={this.state.backTime} type="hidden" name="register[back_call_time]"/>
                        <Datetime
                            locale="ru"
                            dateFormat={true}
                            timeFormat={false}
                            open={true}
                            input={false}
                            isValidDate={this.dateValidate}
                            onChange={this.setBackDate}
                        />
                    </Cell>
                    <Cell sm="1-2" className="register-form__time">
                        <TimePicker
                            focused={true}
                            theme="material"
                            timeMode="24"
                            time={this.state.backTime}
                            onTimeChange={this.onBackTimeChange}
                        />
                    </Cell>
                </Row>
        }

        return (
            <Form className='register-form' method='post' action='/register' onSubmit={this.closeModal}
            onSuccess={() => {
                try { window.yaCounter46138809.reachGoal('zapis-na-priem') } catch (e) {}
            }}>
                <h2>Запись на прием</h2>
                <Row>
                    <Cell>
                        <Input type="text" name="register[fio]" label="ФИО" required="required" />
                    </Cell>
                </Row>
                <Row>
                    <Cell>
                        <Input type="text" name="register[phone]" label="Номер телефона"
                               pattern="[0-9\(\)\-\+ ]*" required="required" />
                    </Cell>
                </Row>
                <Row>
                    <Cell>
                        <Input type="email" name="register[email]" label="E-mail (необязательно)" />
                    </Cell>
                </Row>
                <Row>
                    <Cell>
                        <h3 className="register-form__datetime">Дата и время приема</h3>
                    </Cell>
                </Row>
                <Row>
                    <Cell sm="1-2" className="register-form__date">
                        <Input value={this.state.date} type="text" readOnly="readOnly"
                               name="register[date]" className="register-form__date-input" required="required" updatable/>
                        <input value={this.state.time} type="hidden" name="register[time]"/>
                        <Datetime
                            locale="ru"
                            dateFormat={true}
                            timeFormat={false}
                            open={true}
                            input={false}
                            isValidDate={this.dateValidate}
                            onChange={this.setDate}
                        />
                    </Cell>
                    <Cell sm="1-2" className="register-form__time">
                        <TimePicker
                            focused={true}
                            theme="material"
                            timeMode="24"
                            time={this.state.time}
                            onTimeChange={this.onTimeChange}
                        />
                    </Cell>
                </Row>
                <Row className="register-form__date-back">
                    <Cell>
                        <h3 className="register-form__datetime">Когда Вам перезвонить?</h3>
                    </Cell>
                </Row>
                <Row>
                    <Cell sm="1-2" className="register-form__radio">
                        <label className={classNames("w-checkbox")}>
                            <input className={classNames("i-radio")} type='radio'
                                   name="register_radio"
                                   value="1"
                                   onClick={() => this.onChecked('1')}
                            />
                            <span className="label">В ближайшее время</span>
                        </label>
                    </Cell>
                    <Cell sm="1-2" className="register-form__radio">
                        <label className={classNames("w-checkbox")}>
                            <input className={classNames("i-radio")} type='radio'
                                   name="register_radio"
                                   value="2"
                                   onClick={() => this.onChecked('2')}
                            />
                            <span className="label">Указать дату и время</span>
                        </label>
                    </Cell>
                </Row>
                {back_datetimepicker}
                <Row>
                    <Cell className='register-form__submit'>
                        <input type="submit" value="Отправить заявку" className="btn btn-primary"/>
                    </Cell>
                </Row>
            </Form>
        )
    }
}
