require('babel-eslint');

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/mapStateToProps-prefer-selectors');
const codeSamples = require('../../code-sanity-samples');
const parserOptions = require('../../parser-options');

const ruleTester = new RuleTester({ parserOptions });

ruleTester.run('mapStateToProps-prefer-selectors', rule, {
  valid: [
    ...codeSamples,
    'const mapStateToProps = (state) => 1',
    'const mapStateToProps = (state) => ({})',
    'const mapStateToProps = (state) => ({ x: xSelector(state) })',
    'const mapStateToProps = (state, ownProps) => ({ x: xSelector(state, ownProps) })',
    'const mapStateToProps = (state) => ({ x: xSelector(state), y: ySelector(state) })',
    'const mapStateToProps = (state) => { return { x: xSelector(state) }; }',
    'const mapStateToProps = (state) => { doSomethingElse(); return { x: xSelector(state) }; }',
    'const mapStateToProps = function(state) { return { x: xSelector(state) }; }',
    'function mapStateToProps(state) { doSomethingElse(); return { x: xSelector(state) }; }',
    'withGlobal((state) => ({ x: xSelector(state) }), {})(Comp)',
    'const mapStateToProps = () => ({ x: xSelector() })',
    'const mapStateToProps = function(state) { return { x: getX() }; }',
    'const mapStateToProps = function(state) { return { x: getX(state) }; }',
    'withGlobal((state, ownProps) => ({ x: selector() }), {})(Comp)',
    'withGlobal((state, ownProps) => ({ x: selector(state) }), {})(Comp)',
    'withGlobal((state, ownProps) => ({ x: selector(state, ownProps) }), {})(Comp)',
    {
      code: 'const mapStateToProps = (state) => ({ x: xSelector(state) })',
      options: [{
        matching: '^.*Selector$',
      }],
    },
    {
      code: 'const mapStateToProps = function(state) { return { x: getX(state) }; }',
      options: [{
        matching: '^get.*$',
      }],
    },
    {
      code: 'withGlobal((state) => ({ x: selector(state) }), {})(Comp)',
      options: [{
        matching: '^selector$',
      }],
    },
    {
      code: 'const mapStateToProps = (state) => ({ x: xSelector(differentParam) })',
      options: [{
        validateParams: false,
      }],
    },
    {
      code: 'const mapStateToProps = function(state) { return { x: getX(state, ownProps2) }; }',
      options: [{
        validateParams: false,
      }],
    },
    {
      code: 'withGlobal(() => ({ x: selector(state) }), {})(Comp)',
      options: [{
        validateParams: false,
      }],
    },
  ],
  invalid: [{
    code: 'const mapStateToProps = (state) => ({ x: state.b })',
    errors: [
      {
        message: 'mapStateToProps property "x" should use a selector function.',
      },
    ],
  }, {
    code: 'const mapStateToProps = (state) => ({ x: state.x, y: state.y })',
    errors: [
      {
        message: 'mapStateToProps property "x" should use a selector function.',
      },
      {
        message: 'mapStateToProps property "y" should use a selector function.',
      },
    ],
  }, {
    code: 'const mapStateToProps = (state) => ({ x: state.x, y: ySelector(state) })',
    errors: [
      {
        message: 'mapStateToProps property "x" should use a selector function.',
      },
    ],
  }, {
    code: 'const mapStateToProps = (state) => { return { x: state.b }; }',
    errors: [
      {
        message: 'mapStateToProps property "x" should use a selector function.',
      },
    ],
  }, {
    code: 'const mapStateToProps = (state) => { doSomethingElse(); return { x: state.b }; }',
    errors: [
      {
        message: 'mapStateToProps property "x" should use a selector function.',
      },
    ],
  }, {
    code: 'const mapStateToProps = function(state) { return { x: state.x }; }',
    errors: [
      {
        message: 'mapStateToProps property "x" should use a selector function.',
      },
    ],
  }, {
    code: 'function mapStateToProps(state) { doSomethingElse(); return { x: state.b }; }',
    errors: [
      {
        message: 'mapStateToProps property "x" should use a selector function.',
      },
    ],
  }, {
    code: 'withGlobal((state) => ({ x: state.x }), {})(Comp)',
    errors: [
      {
        message: 'mapStateToProps property "x" should use a selector function.',
      },
    ],
  }, {
    code: 'const mapStateToProps = (state) => ({ x: xSelector(state) })',
    options: [{
      matching: '^get.*$',
    }],
    errors: [{
      message: 'mapStateToProps "x"\'s selector "xSelector" does not match "^get.*$".',
    }],
  }, {
    code: 'const mapStateToProps = function(state) { return { x: getX(state) }; }',
    options: [{
      matching: '^.*Selector$',
    }],
    errors: [{
      message: 'mapStateToProps "x"\'s selector "getX" does not match "^.*Selector$".',
    }],
  }, {
    code: 'withGlobal((state) => ({ x: selectorr(state) }), {})(Comp)',
    options: [{
      matching: '^selector$',
    }],
    errors: [{
      message: 'mapStateToProps "x"\'s selector "selectorr" does not match "^selector$".',
    }],
  }, {
    code: 'const mapStateToProps = (state) => ({ x: xSelector(state, ownProps) })',
    errors: [{
      message: 'mapStateToProps "x"\'s selector "xSelector" parameter #1 is not expected.',
    }],
  }, {
    code: 'const mapStateToProps = (state, ownProps) => ({ x: xSelector(state, ownProps, someOtherValue) })',
    errors: [{
      message: 'mapStateToProps "x"\'s selector "xSelector" parameter #2 is not expected.',
    }],
  }, {
    code: 'const mapStateToProps = function(state) { return { x: getX(notState) }; }',
    errors: [{
      message: 'mapStateToProps "x"\'s selector "getX" parameter #0 should be "state".',
    }],
  }, {
    code: 'withGlobal((state, ownProps) => ({ x: getX(state, notOwnProps) }), {})(Comp)',
    errors: [{
      message: 'mapStateToProps "x"\'s selector "getX" parameter #1 should be "ownProps".',
    }],
  }, {
    code: 'withGlobal((state2, ownProps) => ({ x: getX(state) }), {})(Comp)',
    errors: [{
      message: 'mapStateToProps "x"\'s selector "getX" parameter #0 should be "state2".',
    }],
  }, {
    code: 'withGlobal((state, ownProps2) => ({ x: getX(state, ownProps) }), {})(Comp)',
    errors: [{
      message: 'mapStateToProps "x"\'s selector "getX" parameter #1 should be "ownProps2".',
    }],
  }],

});
