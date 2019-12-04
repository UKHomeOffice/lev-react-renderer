'use strict';

const { createElement } = require('react');
const { renderToString } = require('react-dom/server');
const { ServerStyleSheet } = require('styled-components');

const h = createElement;

const page = (title, styles, body, bundle, props) => `<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
    ${styles}
  </head>
  <body style="margin: 0;">
    <div id="root">
      ${body}
    </div>
    ${props ? `<script>window.appProps = ${JSON.stringify(props).replace(/</g, '\\u003c')};</script>`: ''}
    ${bundle ? `<script type="text/javascript" src="${bundle}" />`: ''}
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
