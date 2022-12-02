require('babel-eslint');

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-unused-prop-types');
const codeSamples = require('../../code-sanity-samples');
const parserOptions = require('../../parser-options');

const ruleTester = new RuleTester({ parserOptions });

ruleTester.run('no-unused-prop-types', rule, {
  valid: [
    ...codeSamples,
    `export const mapStateToProps = (state, sharedGlobal, ownProps) => {
      const { myProp } = ownProps;
      return { myData: getMyData(state, sharedGlobal, myProp)};
    }

    export class MyComponent extends Component {
      render() {
        return <div>{this.props.myData}</div>;
      }
    }

    MyComponent.propTypes = {
      myProp: PropTypes.string.isRequired
    };

    export default withGlobal(mapStateToProps)(MyComponent);`,

    `export const mapStateToProps = (state, sharedGlobal, ownProps) => {
      const myProp = ownProps.myProp;
      return { myData: getMyData(state, sharedGlobal, myProp)};
    }

    export class MyComponent extends Component {
      render() {
        return <div>{this.props.myData}</div>;
      }
    }

    MyComponent.propTypes = {
      myProp: PropTypes.string.isRequired
    };

    export default withGlobal(mapStateToProps)(MyComponent);`,

    `export const mapStateToProps = (state, sharedGlobal, ownProps) => ({
      myData: getMyData(state, sharedGlobal, ownProps.myProp),
    });

    export class MyComponent extends Component {
      render() {
        return <div>{this.props.myData}</div>;
      }
    }

    MyComponent.propTypes = {
      myProp: PropTypes.string.isRequired
    };

    export default withGlobal(mapStateToProps)(MyComponent);`,

    `export const mapReducersToProps = (state, sharedGlobal, ownProps) => ({
      myData: getMyData(state, sharedGlobal, ownProps.myProp),
    });

    export class MyComponent extends Component {
      render() {
        return <div>{this.props.myData}</div>;
      }
    }

    MyComponent.propTypes = {
      myProp: PropTypes.string.isRequired
    };

    export default withGlobal(mapStateToProps)(MyComponent);`,
    `export const mapStateToProps = (state, sharedGlobal, {myProp}) => ({
      myData: getMyData(state, sharedGlobal, myProp.z),
    });

    export class MyComponent extends Component {
      render() {
        return <div>{this.props.myData}</div>;
      }
    }

    MyComponent.propTypes = {
      myProp: PropTypes.string.isRequired
    };

    export default withGlobal(mapStateToProps)(MyComponent);`,
    `const selectorFoo = (state) => ({isFetching: false, name: 'Foo', isDeleting: false, deltedId: ''});
    const selectorBar = (state) => ({ isFetching: false, name: 'Bar'});
    export const mapStateToProps = (state) => {
      const { isFetching: isFetchingFoo, ...restFoo } = selectorFoo(state);
      const { isFetching: isFeatchingBar, ...restBar } = selectorBar(state);
      return {
        isFetchingFoo,
        isFetchingBar,
        ...restFoo,
        ...restBar,
      };
    };
      export class MyComponent extends Component {
      render() {
          const {isFetchingFoo, name, isFetchingBar, isDeleting, deletedId} = this.props;
          return (
            <div>
              <span>{isFetchingFoo}</span>
              <span>{isDeleting}</span>
              <span>{isFetchingBar}</span>
              <span>{name}{deletedId}</span>
            </div>
          )
      }
    };

    MyComponent.propTypes = {
      isFetchingFoo: PropTypes.bool.isRequired,
      isDeleting: PropTypes.bool.isRequired,
      deletedId: PropTypes.number.isRequired,
      name: Proptypes.string.isRequired,
      isFetchingBar: PropTypes.bool.isRequired,
    };

    export default withGlobal(mapStateToProps)(MyComponent);`,
  ],
  invalid: [{
    code: `export const mapStateToProps = (state) => ({
      myData: getMyData(state),
    });

    export class MyComponent extends Component {
      render() {
        return <div>{this.props.myData}</div>;
      }
    }

    MyComponent.propTypes = {
      myProp: PropTypes.string.isRequired
    };

    export default withGlobal(mapStateToProps)(MyComponent);`,

    errors: [
      {
        message: '\'myProp\' PropType is defined but prop is never used',
      },
    ],
  }, {
    code: `export const mapStateToProps = (state, sharedGlobal, ownProps) => ({
      myData: getMyData(state, sharedGlobal, ownProps.myProp),
    });

    export class MyComponent extends Component {
      render() {
        return <div>{this.props.myData}</div>;
      }
    }

    MyComponent.propTypes = {
      myProp: PropTypes.string.isRequired,
      notUsedProp:  PropTypes.string.isRequired,
    };

    export default withGlobal(mapStateToProps)(MyComponent);`,

    errors: [
      {
        message: '\'notUsedProp\' PropType is defined but prop is never used',
      },
    ],
  }, {
    code: `export const mapStateToProps = ({aState}, sharedGlobal, ownProps) => ({
      myData: getMyData(aState),
    });

    export class MyComponent extends Component {
      render() {
        return <div>{this.props.myData}</div>;
      }
    }

    MyComponent.propTypes = {
      myProp: PropTypes.string.isRequired
    };

    export default withGlobal(mapStateToProps)(MyComponent);`,

    errors: [
      {
        message: '\'myProp\' PropType is defined but prop is never used',
      },
    ],
  }, {
    code: `export const mapStateToProps = (state, sharedGlobal, {myProp}) => ({
      myData: getMyData(state, sharedGlobal, myProp),
    });

    export class MyComponent extends Component {
      render() {
        return <div>{this.props.myData}</div>;
      }
    }

    MyComponent.propTypes = {
      myProp: PropTypes.string.isRequired,
      notUsedProp:  PropTypes.string.isRequired,
    };

    export default withGlobal(mapStateToProps)(MyComponent);`,

    errors: [
      {
        message: '\'notUsedProp\' PropType is defined but prop is never used',
      },
    ],
  }, {
    code: `export const mapStateToProps = (state, sharedGlobal, ownProps) => {
      const { myProp } = ownProps;
      return { myData: getMyData(state, sharedGlobal, myProp)};
    }

    export class MyComponent extends Component {
      render() {
        return <div>{this.props.myData}</div>;
      }
    }

    MyComponent.propTypes = {
      myProp: PropTypes.string.isRequired,
      notUsedProp:  PropTypes.string.isRequired,
    };

    export default withGlobal(mapStateToProps)(MyComponent);`,

    errors: [
      {
        message: '\'notUsedProp\' PropType is defined but prop is never used',
      },
    ],
  }],
});
