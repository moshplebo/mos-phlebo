import React, {Component} from 'react'
import classNames from 'classnames';

export default class Input extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value || '',
            type: this.props.type || 'text',
            dirty: false,
            required: this.props.required,
            pattern: props.pattern || '.*',
            readOnly: props.readOnly || false
        };

        //double backslash -> one backslash https://www.w3schools.com/js/js_strings.asp
        if (this.state.type == 'email') {
            this.state.pattern = '[A-Za-z0-9._+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,8}'
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.onChange = this.props.onChange || function(name, value) {};
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.updatable) {
            this.setState({
                value: nextProps.value || '',
                type: nextProps.type || 'text',
                dirty: false,
                required: nextProps.required,
                pattern: nextProps.pattern || '.*',
                readOnly: nextProps.readOnly || false
            })
        }
    }

    handleChange(event) {
        this.setState({value: event.target.value});
        this.onChange(this.props.name, event.target.value);
    }

    handleBlur(event) {
        this.setState({dirty: true});
    }

    render() {

        return (

            <label className={classNames("w-input", {'dirty-input': this.state.dirty})}>
                <input
                    className={"r-input " + this.props.className }
                    type={this.state.type}
                    pattern={this.state.pattern}
                    name={this.props.name}
                    value={this.state.value}
                    onChange={this.handleChange}
                    onBlur={this.handleBlur}
                    required={this.state.required}
                    readOnly={this.state.readOnly}
                />
                <span className="label">{this.props.label}</span>

            </label>

        );
    }

}
