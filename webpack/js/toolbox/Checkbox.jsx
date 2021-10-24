import React, {Component} from 'react'
import classNames from 'classnames';

export default class Checkbox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            checked: this.props.checked || false,
            required: this.props.required
        };
        this.onChange = this.props.onChange || function() {}
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({
            checked: !this.state.checked
        });
        this.onChange()
    }

    render() {

        return (
            <div>
                <label className={classNames("w-checkbox")}>
                    <input className={classNames("i-checkbox")} type='checkbox'
                     checked={this.state.checked} name={this.props.name}
                     value={this.props.value} onChange={this.handleChange}
                     required={this.state.required} />

                    <span className="label">{this.props.label}</span>
                </label>
            </div>
        );
    }

}
