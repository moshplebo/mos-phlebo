import React, {Component} from 'react'
import { DateField, DatePicker } from 'react-date-picker'

export default class DateTimeInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.defaultValue,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(dateString, { dateMoment, timestamp }) {
      this.setState({
        value: dateString
      })
    }

    render() {

        let label = ''
        if (this.props.label) {
            label = <span className="label">{this.props.label}</span>
        }

        return (
            <div className="date-time-input">
                <input type="hidden" name={this.props.name} value={this.state.value}/>
                {label}
                <br/>
                <DateField
                    dateFormat="YYYY-MM-DD HH:mm"
                    forceValidDate={true}
                    updateOnDateClick={true}
                    locale="ru"
                    footer={false}
                    defaultValue={this.props.defaultValue}
                    onChange={this.handleChange}
                >
                        <DatePicker
                            locale="ru"
                            forceValidDate={true}
                            highlightWeekends={false}
                            highlightToday={true}
                            weekNumbers={false}
                            weekStartDay={1}
                            footer={false}
                        />
                </DateField>
                <br/>
            </div>
        );
    }

}
