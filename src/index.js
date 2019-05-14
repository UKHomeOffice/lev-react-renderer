'use strict';

const { createElement } = require('react');
const { renderToString } = require('react-dom/server');
const { ServerStyleSheet } = require('styled-components');

const page = (title, styles, body) => `<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
    ${styles}
  </head>
  <body style="margin: 0;">
    ${body}
  </body>
</html>`;

module.exports = (req, res, next) => {
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
      const body = renderToString(sheet.collectStyles(createElement(component, props, children)));
      const styles = sheet.getStyleTags();

      this.contentType = 'text/html';
      this.send(status, page(title, styles, body));
    } catch (err) {
      log.error(err);
    } finally {
      sheet.seal();
    }
  };

  next();
};
