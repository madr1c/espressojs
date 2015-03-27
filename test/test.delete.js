/**
 * Tests for the .espressojs delete function
 */
var expect = require('chai').expect;
var Espresso = require('../index');
var _ = require('lodash');

var getUndefineds = function(api, key) {
    return _.filter(  _.values(api[key]), _.isUndefined ).length;
};

describe('Espresso.prototype.delete', function() {

    it('should be a function', function() {
        expect( new Espresso().delete ).to.be.a('function');
    });

    it('should take one argument', function() {
        expect( new Espresso().delete.length ).to.equal(1);
    });

    it('should throw if an invalid argument is given', function(){

        var e = new Espresso();

        [ {}, null, undefined, 42, 'string', false ].forEach( function(item) {
            expect( function(){ e.delete(item); } ).to.throw(/(object|empty)/);
        });

        [ { name: '' }, { path: '' }, { pattern: '' } ].forEach( function(item) {
            expect( function(){ e.delete(item); } ).to.throw(/empty/);
        });

        [ { name: 'name' }, { path: 'path' }, { pattern: 'pattern' } ].forEach( function(item) {
            expect( function(){ e.delete(item); } ).not.to.throw();
        });


    });

    it('should delete a resource handler by name', function(done) {

        var api = new Espresso();

        api.resource('/api', function(){});
        api.resource('/api/sub', function(){
            done('failed');
        }, {name:'sub'});
        api.resource('/api/sub/2', function() {
            done();
        });

        var p_ids = getUndefineds(api,'_ids');
        var p_names = getUndefineds(api, '_names');
        var p_resources = api._resources.length;

        api.delete({name:'sub'});

        expect( getUndefineds(api, '_ids') ).not.to.equal(p_ids);
        expect( getUndefineds(api, '_names') ).not.to.equal(p_names);
        expect( _.keys(api._resources).length ).not.to.equal(p_resources);

        api.dispatchRequest( new Espresso.Request({method:'get', path:'/api/sub/2'}) );
    });

    it('should delete a resource handler by pattern', function(done) {

        var api = new Espresso();
        var target = "/api/:sub";

        api.resource('/api', function(){});
        api.resource(target, function(){
            done('failed');
        }, {name:'something'});
        api.resource('/api/sub/2', function() {
            done();
        });

        var p_ids = getUndefineds(api, '_ids');
        var p_names = getUndefineds(api, '_names');
        var p_resources = api._resources.length;

        api.delete({pattern: target});

        expect( getUndefineds(api, '_ids') ).not.to.equal(p_ids);
        // The name entry has also be deleted
        expect( getUndefineds(api, '_names') ).not.to.equal(p_names);
        expect( _.keys(api._resources).length ).not.to.equal(p_resources);

        api.dispatchRequest( new Espresso.Request({method:'get', path:'/api/sub/2'}) );
    });

    it('should delete a resource handler by matching URI', function(done) {

        var api = new Espresso();

        api.resource('/api', function(){});
        api.resource("/api/:subname", function(){
            done('failed');
        }, {name:'subname'});
        api.resource('/api/sub/2', function() {
            done();
        });

        var p_ids = getUndefineds(api, '_ids');
        var p_names = getUndefineds(api, '_names');
        var p_resources = api._resources.length;

        api.delete({path: "/api/cool"});

        expect( getUndefineds(api, '_ids') ).not.to.equal(p_ids);
        expect( getUndefineds(api, '_names') ).not.to.equal(p_names);
        expect( _.keys(api._resources).length ).not.to.equal(p_resources);

        api.dispatchRequest( new Espresso.Request({method:'get', path:'/api/sub/2'}) );
    });

    it('should not error if there is no such resource', function() {
        var api = new Espresso();

        [ { name: 'name' }, { path: 'path' }, { pattern: 'pattern' } ].forEach( function(item) {
            expect( function(){ api.delete(item); } ).not.to.throw();
        });

    });

});
