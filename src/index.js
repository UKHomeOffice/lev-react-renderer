'use strict';

const { createElement } = require('react');
const { hydrate } = require('react-dom');
const { renderToString } = require('react-dom/server');
const { ServerStyleSheet } = require('styled-components');

const h = createElement;

const page = (title, styles, body, bundle, props, scripts) => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#0b0c0c" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    ${styles}
    ${scripts ? scripts.map(e => `<script src="${e}"></script>`) : ''}
    ${props ? `<script>window.hydrationProps = ${JSON.stringify(props).replace(/</g, '\\u003c')};</script>`: ''}
  </head>
  <body style="margin: 0;">
    <div id="root">
      ${body}
    </div>
    ${bundle ? `<script src="${bundle}"></script>`: ''}
  </body>
</html>`;

module.exports = (config) => (req, res, next) => {
  const log = req.log;

  res.render = function(status, component, props, children) {
    if (typeof status !== 'number') {
      children = props;
      props = component;
      component = status;
      status = 200;
    }

    const title = props && props.title || '';
    const sheet = new ServerStyleSheet();

    try {
      const body = renderToString(sheet.collectStyles(h(component, props, children)));
      const styles = sheet.getStyleTags();

      this.contentType = 'text/html';
      this.send(status, page(title, styles, body, config && config.bundle, {...props, children}));
    } catch (err) {
      log.error(err);
    } finally {
      sheet.seal();
    }
  };

  next();
};

module.exports.hydrate = Component => hydrate(h(Component, window.hydrationProps), document.getElementById('root'));
