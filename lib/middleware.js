var ReactAsync = require('react-async');
var url        = require('url');
var invariant  = require('react/lib/invariant');

module.exports = function(opts) {
  invariant(
    opts.app,
    'Must supply a valid react component to render'
  );

  var App = opts.app;
  var props = opts.props || {};

  return function(req, res, next) {
    props.path = url.parse(req.url).pathname;
    ReactAsync.renderComponentToStringWithAsyncState(
      App(props),
      function(err, markup, data) {
        if (err) return next(err);
        markup = ReactAsync.injectIntoMarkup(markup, data, [props.bundle])
        res.send('<!doctype>' + markup);
      }
    );
  };
}