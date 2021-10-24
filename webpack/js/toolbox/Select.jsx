import React, {Component} from 'react'
import classNames from 'classnames';

export default class Select extends Component {

    constructor(props) {
        super(props);
        this.state = {open: false};
        this.state.selected = props.selected || '';
        this.openSelect = this.openSelect.bind(this);
        this.closeSelect = this.closeSelect.bind(this);

        this.onChange = this.props.onChange || function (name, value) {};
    }

    componentWillReceiveProps(nextProps) {
        this.setState({selected: nextProps.selected})
    }
    closeSelect() {
        this.setState({open: false});
        window.removeEventListener('click', this.closeSelect);
    }

    openSelect(e) {
        e.stopPropagation();

        window.addEventListener('click', this.closeSelect);
        this.setState({open: true})
    }

    selectOption(key) {
        this.setState({selected: key, open: false});
        window.removeEventListener('click', this.closeSelect);
        this.onChange(this.props.name, key);
    }

    onScrollHandler(e, elem) {

        e.persist();
        e.stopPropagation();

        var scrollTop = elem.scrollTop;
        var scrollHeight = elem.scrollHeight;
        var height = elem.clientHeight;
        var wheelDelta = e.deltaY;
        var isDeltaPositive = wheelDelta > 0;

        if (isDeltaPositive && wheelDelta > scrollHeight - height - scrollTop) {
            e.preventDefault();
        } else if (!isDeltaPositive && -wheelDelta > scrollTop) {
            e.preventDefault();
        }
    }

    render() {

        let select = '';
        if (!this.state.open) {
            select = (
                <div onClick={this.openSelect}>
                    <div className="r-option">
                        {this.props.options[this.state.selected]}
                        <i className="mdi mdi-chevron-down"></i>
                    </div>
                    <div className="label">{this.props.label}</div>
                </div>
            );
        } else {

            let maxHeight = window.innerHeight - this.refs.select.getBoundingClientRect().top - 50;
            if (maxHeight < 200) {

                window.scrollBy(0, (180 - maxHeight));
                maxHeight = 200;
            }

            let options = this.props.options;

            select = [];
            for (var key in options) {
                if (options.hasOwnProperty(key)) {
                    select.push(
                        <Option key={key} text={options[key]}
                                onClick={this.selectOption.bind(this, key)}
                                classNames={classNames(
                                    'option',
                                    {'option-selected': (key == this.state.selected)}
                                )}/>
                    )
                }
            }

            select = (
                <div className="r-options" ref="options" style={{maxHeight: maxHeight}}
                     onWheel={(event) => this.onScrollHandler(event, this.refs.options)}>
                    {select}
                </div>
            );

        }

        return (

            <div className="w-select" ref='select'>
                <input type="hidden" value={this.state.selected} name={this.props.name}/>
                {select}
            </div>

        );
    }

}

class Option extends Component {

    render() {
        return (
            <div className={this.props.classNames} onClick={this.props.onClick}>
                {this.props.text}
            </div>
        );
    }
}
