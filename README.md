Life Event Verification's React rendering middleware for Restify
================================================================

A [Restify] middleware that provides a `res.render` method for sending HTML
responses based on a [React] component. [styled-components] is supported.

Currently, all rendering is done server-side and there is no hydration to make
the response isomorphic.


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

httpd.use(reactRenderer);

httpd.get('/', (req, res, next) => {
  res.render(YourApp, yourProps);
});

httpd.listen(8080, '0.0.0.0', () => {
  log.info('%s listening at %s', httpd.name, httpd.url);
});
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
