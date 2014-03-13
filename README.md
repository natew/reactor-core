This is a small but (at this point) fairly opinionated module that should let you get up and running with a React app quickly.

It uses the following modules to achieve this:
- Routing: [reactor-router](https://github.com/natew/reactor-router)
- HTML5 pushState: [reactor-pushState](https://github.com/natew/reactor-pushState)
- Async data fetch: [react-async](https://github.com/andreypopp/react-async)

Check out a demo of it in use [in this repo](https://github.com/natew/reactor-demo).

### Example

    var React      = require('react');
    var Reactor    = require('reactor-core').inject(React);
    var Layout     = require('./layouts/myHTMLLayout');

    var App = Reactor.createClass({

      routes: {
        '/': require('./pages/Home')
      },

      render: function(Page) {
        return this.transferPropsTo(
          <Layout onClick={this.navigate} title={this.state.title}>
            <Page data={this.state.pageData} className="page" />
          </Layout>
        );
      }

    });

    Reactor.browserStart(App);
    module.exports = App;

### Middleware

Reactor comes with a simple middleware to help you render your app. You can use it like so:

    var express = require('express');
    var Server = express();
    var App = require('./app'); // top level react component

    Server.use(reactorMiddleware({
      app: App,
      props: {
        // props to pass to your top level component
      }
    }))
    .listen(3000);


### Warning

This is all very early stages and is just being extracted into it's own module so things will change. More documentation to come!

### License

The MIT License (MIT)

Copyright (c) 2014 Nate Wienert

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.