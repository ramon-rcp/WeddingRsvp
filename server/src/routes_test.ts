import { save, load, names, values, clear } from './routes';
import * as httpMocks from 'node-mocks-http';
import * as assert from 'assert';



describe('routes', function() {

  const g1: unknown = ['lopez', ['James', true, 0, undefined, ['none', undefined]]];
  const g2: unknown = ['maria', ['Molly', false, 1, 'beta', ['none', 'many']]];

  it('save', function() {
    // First branch, straight line code, error case
    const req = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {name: 1086, content: g1}});
    const res = httpMocks.createResponse();
    save(req, res);

    assert.deepStrictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(),
        'required argument "name" was missing');

    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {content: g1}});
    const res1 = httpMocks.createResponse();
    save(req1, res1);

    assert.deepStrictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        'required argument "name" was missing');

    // Second branch, straight line code, error case
    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {name: "A"}});
    const res2 = httpMocks.createResponse();
    save(req2, res2);

    assert.deepStrictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(),
        'required argument "content" was missing');

    // Third branch, straight line code
    const req5 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "A", content: g1}});
    const res5 = httpMocks.createResponse();
    save(req5, res5);

    assert.deepStrictEqual(res5._getStatusCode(), 200);
    assert.deepStrictEqual(res5._getData(), {saved: true});

    const req6 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "B", content: g2}});
    const res6 = httpMocks.createResponse();
    save(req6, res6);

    assert.deepStrictEqual(res6._getStatusCode(), 200);
    assert.deepStrictEqual(res6._getData(), {saved: true});

    // Called to clear all saved transcripts created in this test
    //    to not effect future tests
    clear();
  });

  it('load', function() {
    // First branch, straight line code, error case
    const req = httpMocks.createRequest(
        {method: 'GET', url: '/load', query: {name: 1086}});
    const res = httpMocks.createResponse();
    load(req, res);

    assert.deepStrictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(),
        'required argument "name" was missing');

    const req1 = httpMocks.createRequest(
        {method: 'GET', url: '/load', query: {}});
    const res1 = httpMocks.createResponse();
    load(req1, res1);

    assert.deepStrictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        'required argument "name" was missing');

    //Second branch, straight line code
    const req2 = httpMocks.createRequest(
      {method: 'GET', url: '/load', query: {name: 'caca'}});
    const res2 = httpMocks.createResponse();
    load(req2, res2);

    assert.deepStrictEqual(res2._getStatusCode(), 404);
    assert.deepStrictEqual(res2._getData(),
        'could not find guest caca');

    const req3 = httpMocks.createRequest(
        {method: 'GET', url: '/load', query: {name: 'pep'}});
    const res3 = httpMocks.createResponse();
    load(req3, res3);

    assert.deepStrictEqual(res3._getStatusCode(), 404);
    assert.deepStrictEqual(res3._getData(),
        'could not find guest pep');

    //Third branch, straight line code
    const saveReq1 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "dude", content: g1}});
    const saveResp1 = httpMocks.createResponse();
    save(saveReq1, saveResp1);
    const loadReq1 = httpMocks.createRequest(
        {method: 'GET', url: '/load', query: {name: "dude"}});
    const loadRes1 = httpMocks.createResponse();
    load(loadReq1, loadRes1);
    assert.deepStrictEqual(loadRes1._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes1._getData(), {name: 'dude', content: g1});

    const saveReq2 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "son", content: g2}});
    const saveResp2 = httpMocks.createResponse();
    save(saveReq2, saveResp2);
    const loadReq2 = httpMocks.createRequest(
        {method: 'GET', url: '/load', query: {name: "son"}});
    const loadRes2 = httpMocks.createResponse();
    load(loadReq2, loadRes2);
    assert.deepStrictEqual(loadRes2._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes2._getData(), {name: 'son', content: g2});

    // Called to clear all saved transcripts created in this test
    //    to not effect future tests
    clear();
  });

  it('names', function() {
    //2 test per subdomain, straight-line code
    const saveReq1 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "dude", content: g1}});
    const saveResp1 = httpMocks.createResponse();
    save(saveReq1, saveResp1);
    const req1 = httpMocks.createRequest(
      {method: 'GET', url: '/names'});
    const res1 = httpMocks.createResponse();
    names(req1, res1);

    assert.deepStrictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), {names: ['dude']})

    const saveReq2 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "son", content: g2}});
    const saveResp2 = httpMocks.createResponse();
    save(saveReq2, saveResp2);
    
    names(req1, res1);

    assert.deepStrictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), {names: ['dude', 'son']})

    clear()
  })

  it('values', function() {
    //2 test per subdomain, straight-line code
    const saveReq1 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "dude", content: g1}});
    const saveResp1 = httpMocks.createResponse();
    save(saveReq1, saveResp1);
    const req1 = httpMocks.createRequest(
      {method: 'GET', url: '/values'});
    const res1 = httpMocks.createResponse();
    values(req1, res1);

    assert.deepStrictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), {values: [g1]})

    const saveReq2 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "son", content: g2}});
    const saveResp2 = httpMocks.createResponse();
    save(saveReq2, saveResp2);
    
    values(req1, res1);

    assert.deepStrictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), {values: [g1, g2]})

    clear()
  })

});
