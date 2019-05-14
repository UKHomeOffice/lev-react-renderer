'use strict';

const reactRenderer = require('../../src');
const styled = require('styled-components');

const logErrorStub = sinon.stub();
const nextStub = sinon.stub();
const sendStub = sinon.stub();

const req = {
  log: {
    error: logErrorStub
  }
};

const MyComponent = styled.default.div`
  width: 100%;
  height: 100%;
  background: #FF0000;
`;

describe('index.js', () => {
  it('is a function', () => (typeof reactRenderer).should.equal('function'));
  it('is a middleware', () => reactRenderer.length.should.equal(3));

  describe('when called', () => {
    let res;

    before(() => {
      res = {
        send: sendStub
      };

      reactRenderer(req, res, nextStub);
    });

    it('adds a render method to res', () => (typeof res.render).should.equal('function'));

    describe('res.render()', () => {
      it('takes 4 arguments', () => res.render.length.should.equal(4));

      describe('when called without a status argument', () => {
        before(() => {
          res.render(MyComponent);
        });

        it('responds', () => sendStub.should.have.been.called);
        it('responds with an html content type', () => res.contentType.should.equal('text/html'));
        it('responds with a 200 status', () => sendStub.should.have.been.calledWith(200));
      });

      describe('when called with a status argument', () => {
        before(() => {
          res.render(418, MyComponent);
        });

        it('responds', () => sendStub.should.have.been.called);
        it('responds with an html content type', () => res.contentType.should.equal('text/html'));
        it('responds with the status code set', () => sendStub.should.have.been.calledWith(418));
      });
    });
  });
});
