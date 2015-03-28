/**
 * Tests for resource IDs used internally
 */
var Espresso = require('../index');
var _ = require('lodash');
var expect = require('chai').expect;

describe('ID table', function() {

    it('should be stored in _ids in the API instance', function() {
        var api = new Espresso();
        expect( api._ids ).to.be.an('object');
    });

    it('should have zero entries by default', function() {
        var api = new Espresso();
        expect( _.keys(api._ids).length ).to.equal(0);
    });

    it('should always have the same number of entries as the resources table', function() {
        var e = new Espresso();

        _.each(['a','b','c','d','e','f','g'], function(n){
            e.resource(n,function(){});
            expect( _.keys(e._ids).length ).to.equal( e._resources.length );
        });

    });

    it('should replace duplicate handlers', function(done) {
        var e = new Espresso();


        e.resource('/:api', function(){
            done('failed');
        });

        e.resource('/:api', function(){
            done('failed');
        });

        e.resource('/:another', function(){
            done();
        });

        expect( _.keys(e._ids).length ).to.equal(1);

        e.dispatchRequest( new Espresso.Request({path:'/api', method:'get'}) );

    });

});

describe('Name table', function() {

    it('should be stored in _names in the API instance', function() {
        var api = new Espresso();
        expect( api._names ).to.be.an('object');
    });

    it('should have zero entries by default', function() {
        var api = new Espresso();
        expect( _.keys(api._names).length ).to.equal(0);
    });

    it('should always have the same number of entries as the resources table', function() {
        var e = new Espresso();

        _.each(['a','b','c','d','e','f','g'], function(n){
            e.resource(n,function(){},{ name: 'pattern'+n });
            expect( _.keys(e._names).length ).to.equal( e._resources.length );
        });

    });

    it('should not add entries if no name is given', function() {
        var e = new Espresso();

        _.each(['a','b','c','d','e','f','g'], function(n){
            e.resource(n,function(){});
            expect( _.keys(e._names).length ).to.equal( 0 );
        });
    });

    it('should replace duplicate name entries', function(done) {
        var e = new Espresso();


        e.resource('/:api', function(){
            done('failed');
        }, {name: 'api1'});

        e.resource('/:api', function(){
            done('failed');
        }, {name:'api1'});

        e.resource('/:another', function(){
            done();
        }, {name: 'api1'});

        expect( _.keys(e._names).length ).to.equal(1);

        e.dispatchRequest( new Espresso.Request({path:'/api', method:'get'}) );

    });

});

describe('Overwriting', function() {

    it('should overwrite if a handler for another resource has the same name', function(){
        var api = new Espresso();

        var fn = function(){};

        api.resource('/api', function(){}, {name:'root'});
        api.resource('/api/sub', fn, {name:'root'});

        expect( _.keys(api._names).length ).to.equal(1);
        expect( _.keys(api._ids).length ).to.equal(2);
        expect( _.keys(api._names)[0] ).to.equal('root');

        // Deep check the handler function
        expect( api._names.root.getCallback('get') ).to.equal(fn);
    });

    it('should replace the name if a handler for the same resource with another name was added', function() {
        var api = new Espresso();

        api.resource('/api', function(){}, {name:'root'});
        api.resource('/api', function(){}, {name:'non-root'});

        // Length checks won't work here properly
        expect( api._names.root ).to.be.undefined;
        expect( api._names['non-root'] ).to.not.be.undefined;

    });


    it('should correctly update the name reference if a new handler is given', function() {
        var api = new Espresso();

        var uniqueString = 'root@2';

        api.resource('/api', function(){}, {name:'root'});
        api.resource('/api', function(){ return uniqueString; } );

        // Length checks won't work here properly
        var cb = api._names.root.getCallback('get');
        expect( cb() ).to.equal( uniqueString );

    });

    it('should correctly update the name reference if a new handler with placeholders is given', function() {
        var api = new Espresso();

        var uniqueString = 'root@2';

        api.resource('/:key', function(){}, {name:'root'});
        api.resource('/:app', function(){ return uniqueString; } );

        // Length checks won't work here properly
        var cb = api._names.root.getCallback('get');
        expect( cb() ).to.equal( uniqueString );

    });

});
