var ReactAsync = require('react-async');
var ReactMount = require('react/lib/ReactMount');
var Router     = require('reactor-router');
var PushState  = require('reactor-pushState');
var Superagent = require('superagent');
var isBrowser  = (typeof window !== 'undefined');

// Reactor provides a top level class for building React apps
// Allows for:
//   - handling of routes
//   - async rendering
//   - pushState navigation

ReactMount.allowFullPageRender = true;

var Reactor = {

  browserStart: function(App) {
    if (!isBrowser) return;
    window.React = React;
    window.onload = function() {
      Reactor.activePage = React.renderComponent(App(), document);
    };
  },

  createClass: function(spec) {
    Router.setRoutes(spec.routes);

    var reactorSpec = {
      mixins: [
        Router,
        PushState,
        ReactAsync.Mixin
      ],

      statics: spec.statics,
      routes: spec.routes,

      shouldComponentUpdate: function() {
        this.shouldUpdate;
      },

      getInitialStateAsync: function(cb) {
        this.setRoute(this.props.path);
        this.getStateFromPage(cb);
      },

      routerPageChange: function(cb) {
        this.getStateFromPage(function(err, data) {
          cb(this.setState(err ? {error: err} : data));
        }.bind(this));
      },

      getStateFromPage: function(cb) {
        var root = this.rootUrl()
        var route = this.route;
        var page = route.page;

        if (!page.props) cb(null, { data: null });
        else page.props(root, route.params, function(data) {
          var t = page.title;
          var state = {
            data: data,
            title: typeof t == 'function' ? t(data) : t
          };

          if (spec.getInitialState) {
            var specState = spec.getInitialState();
            for (var key in specState)
              if (specState.hasOwnProperty(key))
                state[key] = specState[key]
          }

          cb(null, state);
        });
      },

      render: function() {
        return spec.render.call(this, this.route.page, this.state.data);
      }

    };

    for (var key in spec)
      if (spec.hasOwnProperty(key) && ['render', 'getInitialState'].indexOf(key) === -1)
        reactorSpec[key] = spec[key];

    return React.createClass(reactorSpec);
  },

  inject: function(react) {
    React = react;
    react.createPageClass = ReactorCore.createPage;
    react.createAppClass = ReactorCore.createPage;
    react.getStateFromPage = ReactorCore.getStateFromPage;
    react.isBrowser = isBrowser;
    return this;
  }

};

module.exports = Reactor;

var ReactorCore = {

  createPage: function(spec) {
    var reactSpec = {
      statics: {
        title: spec.title,
        props: ReactorCore.get(spec.fetch, spec.getInitialProps),
        update: spec.update || function() {}
      }
    };

    for (var key in spec)
      if (spec.hasOwnProperty(key))
        reactSpec[key] = spec[key];

    return React.createClass(reactSpec);
  },

  cache: {},

  get: function(path, pageCb) {
    return function(root, params, cb) {
      if (typeof params == 'object')
        path = this.replaceParams(path, params);

      if (this.cache[path])
        cb(this.cache[path]);
      else {
        Superagent
        .get(root + path)
        .end(function(err, res) {
          if (!err && res) {
            var result = res.body;
            if (pageCb) result = pageCb(result, params);
            this.cache[path] = result;
            cb(result);
          }
          else {
            cb({error: err});
          }
        }.bind(this));
      }
    }.bind(this);
  },

  replaceParams: function(url, params) {
    var paramKeys = Object.keys(params);

    paramKeys.map(function(param) {
      url = url.replace(':' + param, params[param]);
    });

    if (paramKeys.length)
      url = url.replace(/(\/:[^\/]+)+/, '');

    return url;
  }
};