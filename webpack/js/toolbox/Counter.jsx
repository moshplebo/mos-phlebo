import React, {Component} from 'react'
import classNames from 'classnames';

export default class Counter extends Component {
    static defaultProps = {
        minValue: 0
    }

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value || this.props.minValue,
            type: 'number',
            dirty: false,
            required: this.props.required,
            disabled: this.props.disabled || false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.decrement = this.decrement.bind(this);
        this.increment = this.increment.bind(this);

        this.onChange = this.props.onChange || function(v) {};
        this.onChange = this.onChange.bind(this);

    }

    componentWillReceiveProps(nextProps) {
      this.setState({
        value: nextProps.value,
        disabled: nextProps.disabled
      });
    }

    changeValue(value) {
        value = parseInt(value);
        if (value >= 1000000) {
            value = 999999;
        } else if (value < this.props.minValue) {
            value = this.props.minValue;
        }
        this.setState({value: value});
        this.onChange(value)
    }

    handleChange(event) {
        this.changeValue(event.target.value);
    }

    handleBlur(event) {
        this.setState({dirty: true});
    }

    decrement(e) {
        e.preventDefault();
        let value = parseInt(this.state.value) - 1;
        this.changeValue(value);
    }

    increment(e) {
        e.preventDefault();
        let value = parseInt(this.state.value) + 1;
        this.changeValue(value);
    }


    render() {
        return (

            <div className={classNames("counter-input", this.props.className, {'dirty-input': this.state.dirty})} style={this.props.style}>
                <button title={this.props.title} className="btn" onClick={this.decrement} disabled={this.state.disabled}>–</button>
                <input className={classNames("r-input")} type={this.state.type}
                 name={this.props.name} value={this.state.value}
                 onChange={this.handleChange} onBlur={this.handleBlur}
                 required={this.state.required}  max="1000000"
                 pattern="[0-9]*" inputMode="numeric" disabled={this.state.disabled} title={this.props.title} />
                <button title={this.props.title} className="btn" onClick={this.increment} disabled={this.state.disabled}>+</button>
                <span className="label">{this.props.label}</span>
            </div>

        );
    }

}
