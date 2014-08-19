var assert = require('assert');
var React = require('react');
var Reactor = require('reactor-core').inject(React);

describe('reactor-core', function() {
  var date = new Date(1987, 4, 8, 5, 0, 0, 0);

  it('passes parameters and renders page', function() {
    var page = React.createClass({
      getProps: function(root, params, cb) {
        cb(null, { url: root, params: params });
      },

      render: function() {
        return React.DOM.div(null, 'params: ' + this.props.params.join(', '));
      }
    });

    var componentString = React.renderComponentToString(page);

    assert.equal(componentString, '<div>params: ');
  });

});