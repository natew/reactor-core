This is a small but (at this point) fairly opinionated module that should let you get up and running with a React app quickly.

It uses the following modules to achieve this:
- Routing: [reactor-router](https://github.com/natew/reactor-router)
- HTML5 pushState: [reactor-pushState](https://github.com/natew/reactor-pushState)
- Async data fetch: [react-async](https://github.com/andreypopp/react-async)
- State management: [Cortex](https://github.com/kaelzhang/cortex)

Check out a demo of it in use [in this repo](https://github.com/natew/reactor-demo).

Basic usage:

    var React      = require('react');
    var Reactor    = require('reactor').inject(React);

    var App = Reactor.createClass({

      routes: {
        '/': require('./pages/Home')
      },

      render: function(Page) {
        return this.transferPropsTo(
          <Layout onClick={this.navigate} title={this.pageTitle}>
            <Page data={this.pageData} className="page" />
          </Layout>
        );
      }

    });

    Reactor.browserStart(App);
    module.exports = App;

This is very early stages and is just being extracted into it's own module so things will change. More documentation to come!