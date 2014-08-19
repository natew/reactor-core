var ReactAsync = require('react-async');
var ReactMount = require('react/lib/ReactMount');
var Router     = require('reactor-router');
var PushState  = require('reactor-pushState');
var isBrowser  = (typeof window !== 'undefined');

/*
 *   ReactorCore provides a top level class for building React apps
 *   as well as adding a special class creation method that should be
 *   injected into React itself.
 *
 *   Reactor at the top level does:
 *     handling of routes
 *     async rendering
 *     pushState navigation
 *
 *   Reactor.createPage then allows you to set:
 */

ReactMount.allowFullPageRender = true;

/*
 * Reactor should be used at the top level to start an app
 *   Reactor.createClass() works like a normal React component
 *   but also has logic to handle Reactor pages.
 *
 *   Use Reactor.browserStart() to start your app in the browser.
 */

var Reactor = {

  browserStart: function(App) {
    if (!isBrowser) return;

    // Globalize React
    window.React = React;

    // Attach first render to window.onload
    window.onload = function() {
      Reactor.activePage = React.renderComponent(App(), document);
    };

    // Enable GSS if wanted
    if (isBrowser && App.gss_worker)
      window.GSS_CONFIG = { worker: App.gss_worker };
  },

  createClass: function(spec) {
    if (spec.routes)
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

      // Handles initial page load
      getInitialStateAsync: function(cb) {
        this.setRoute(this.props.path);
        this.getStateFromPage(cb);
      },

      // Handles subsequent page loads
      routerPageChange: function(cb) {
        this.getStateFromPage(function(err, data) {
          cb(this.setState(err ? {error: err} : data));
        }.bind(this));
      },

      // Universal page loading logic
      getStateFromPage: function(cb) {
        var root = this.rootUrl();
        var route = this.route;
        var page = route.page;
        var params = route.params;

        if (!page.getProps) cb(null, null);
        else
          page.getProps(root, params, function(err, data) {
            var state = {
              data: data,
              err: err,
              reactor: {},
            };

            // Set head properties
            for (var key in page.reactor) {
              var prop = page.reactor[key];
              var value = typeof prop == 'function' ?
                prop(data, params) :
                prop;

              state.reactor[key] = value;
            };

            cb(err, state);
          });
      },

      render: function() {
        return spec.render.call(this, this.route.page, this.state.data);
      }

    };

    // Copy over keys from your class to top level Reactor.createClass spec
    var reservedKeys = [
      'render',
      'getInitialState'
    ];

    for (var key in spec) {
      if (spec.hasOwnProperty(key) && reservedKeys.indexOf(key) === -1) {
        reactorSpec[key] = spec[key];
      }
    }

    // Shim to React
    return reactorSpec;
  },

  /*
   *  Reactor.inject takes React as its parameter and adds a few methods to React
   *    isBrowser: Helper method to detect if running in browser
   */
  inject: function(react) {
    // TODO: Invariant to check for React
    React = react;
    react.isBrowser = isBrowser;
    return this;
  }

};

module.exports = Reactor;