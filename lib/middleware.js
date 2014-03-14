var ReactAsync = require('react-async');
var url        = require('url');
var invariant  = require('react/lib/invariant');

module.exports = function(app, opts) {
  invariant(
    app && typeof app == 'function',
    'Must supply a valid react component to render'
  );

  var props = opts.props || {};
  var wrapper = opts.wrapper || function(markup) {
    return '<!doctype>' + markup;
  };

  return function(req, res, next) {
    props.path = url.parse(req.url).pathname;
    ReactAsync.renderComponentToStringWithAsyncState(
      app(props),
      function(err, markup, data) {
        if (err) return next(err);
        markup = ReactAsync.injectIntoMarkup(markup, data, [props.bundle])
        res.send(wrapper(markup));
      }
    );
  };
}