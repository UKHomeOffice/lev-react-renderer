React rendering middleware for Restify
======================================

A [Restify] middleware that provides a `res.render` method for sending HTML
responses based on a [React] component. [styled-components] is supported.

The rendering is done server-side (SSR) but isomorphic / client-side rendering is
also supported by providing a link to your bundle.


Installation
============

```shell
npm install --save lev-react-renderer
```


Usage
=====

```js
'use strict';

const restify = require('restify');
const reactRenderer = require('lev-react-renderer');

const formatText = restify.formatters['text/plain; q=0.3'];

const httpd = restify.createServer({
  formatters: {
    'text/html': formatText
  }
});

httpd.use(reactRenderer());

httpd.get('/', (req, res, next) => {
  res.render(YourApp, yourProps);
});

httpd.listen(8080, '0.0.0.0', () => {
  log.info('%s listening at %s', httpd.name, httpd.url);
});
```


### Isomorphic rendering

In addition to Server-Side Rendering (SSR) this library supports 'hydrating'
your application on the client-side. To do so, simply provide the location of
your 'bundle' when creating the middleware. e.g.

```js
httpd.use(reactRenderer({
  bundle: 'public/bundle.js'
}));
```

The bundle should hydrate the `#root` element with the same component you are
passing to `res.render()` using the `window.appProps` variable. e.g.

```js
import React from 'react';
import { hydrate } from 'react-dom';
import { YourApp } from './YourApp';

hydrate(React.createElement(YourApp, window.appProps), document.getElementById('root'));
```


Working on this repository
--------------------------

To test changes to this repository simply run:
```bash
make test
```

[React]: https://reactjs.org/
[Restify]: http://restify.com/
[styled-components]: https://www.styled-components.com/
