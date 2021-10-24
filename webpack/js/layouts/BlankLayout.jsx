import React, {Component} from 'react'
import classNames from 'classnames';
import ReactiveLink from '../toolbox/ReactiveLink.jsx'
import Hero from '../toolbox/Hero.jsx'

export default class BlankLayout extends Component {

    render() {
        const childrenWithProps = React.Children.map(this.props.children,
            (child) => React.cloneElement(child, this.props)
        );

        return (
          <div>
            {childrenWithProps}
          </div>
        );
    }

}
