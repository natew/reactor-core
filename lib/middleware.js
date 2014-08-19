var React = require('react');
var ReactAsync = require('react-async');
var url        = require('url');
var invariant  = require('react/lib/invariant');

module.exports = function(app, opts) {
  console.log('APP', app)
  var reactApp = React.createClass(app);
  var props = opts.props || {};
  var wrapper = opts.wrapper || function(markup) {
    return markup;
  };

  // this causes the error...
  console.log(React.renderComponentToString(reactApp({ path: '/' })));

  return function(req, res, next) {
    // Set props for current url path
    props.path = url.parse(req.url).pathname;

    // Initial server render
    ReactAsync.renderComponentToStringWithAsyncState(
      reactApp(props),
      function(err, markup, data) {
        if (err) return next(err);

        // Injects the data we have into the markup thats served
        // So once the app starts in browser, it has the same data
        markup = ReactAsync.injectIntoMarkup(markup, data, [props.bundle])

        // Return html with optional wrapper function
        res.send(wrapper(markup));
      }
    );
  };
}