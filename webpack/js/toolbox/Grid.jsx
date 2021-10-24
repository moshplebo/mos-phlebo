import React, {Component} from 'react'
import classNames from 'classnames';


class Wrapper extends Component {
    render() {
        return (
            <div id={this.props.id} style={this.props.style}
             className={classNames('wrapper', this.props.className)} >
                {this.props.children}
            </div>
        );
    }
}
class Container extends Component {
    render() {
        return (
            <div className={classNames('container', this.props.className)}id={this.props.id}>
                {this.props.children}
            </div>
        );
    }
}

class Row extends Component {
    render() {
        return (

            <div className={classNames('row', this.props.className)} id={this.props.id}>
                {this.props.children}
            </div>
        );
    }
}


class Cell extends Component {
    render() {

        let classesNames = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

        var defaultSize = '1-1';
        var classes = classesNames.map(function (name) {
            let size = this.props[name] || defaultSize;
            defaultSize = size;
            return name + '-' + size;
        }.bind(this));


        return (
            <div id={this.props.id} style={this.props.style}
             className={classNames(
                 'cell',
                 classes,
                 this.props.className,
                 {'cell-padded': this.props.padded},
                 this.props.classes
             )}>
                {this.props.children}
            </div>
        );
    }
}


export {Wrapper, Container, Row, Cell}
