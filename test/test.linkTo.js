/**
 * Tests for the .linkTo method
 */
var _ = require('lodash');
var Espresso = require('../index');
var expect = require('chai').expect;

describe('.linkTo', function() {

    it('should be a function', function() {
        expect( new Espresso().linkTo ).to.be.a('function');
    });

    it('should take two arguments', function() {
        expect( new Espresso().linkTo.length ).to.equal(2);
    });

    it('should return the API URL when invoked w/out arguments', function() {
        var e = new Espresso({
            protocol: 'https',
            hostname: 'apiserver.example.org',
            apiRoot: '/api/v1',
            port: '1024'
        });

        expect( e.linkTo() ).to.equal( 'https://apiserver.example.org:1024/api/v1' );

    });

    it('should link to something when given a string', function() {
        var e = new Espresso({
            protocol: 'https',
            hostname: 'apiserver.example.org',
            apiRoot: '/api/v1',
            port: '1024'
        });

        expect( e.linkTo('/store/keys') ).to.equal( 'https://apiserver.example.org:1024/api/v1/store/keys' );

    });

    it('should link to a resource by name', function() {
        var e = new Espresso({
            protocol: 'https',
            hostname: 'apiserver.example.org',
            apiRoot: '/api/v1',
            port: '1024'
        });

        e.resource('/key', function(){}, {name:'key'});
        e.resource('/key/:pattern', function(){}, {name:'key2'});

        expect( e.linkTo({name:'key2'}) ).to.equal( 'https://apiserver.example.org:1024/api/v1/key/:pattern' );
        expect( e.linkTo({name:'key'}) ).to.equal( 'https://apiserver.example.org:1024/api/v1/key' );

    });

    it('should link to a resource by name replacing placeholders', function() {
        var e = new Espresso({
            protocol: 'https',
            hostname: 'apiserver.example.org',
            apiRoot: '/api/v1',
            port: '1024'
        });

        e.resource('/:key/:pattern', function(){}, {name:'key'});

        expect(

                e.linkTo({name:'key'},{key:'some', pattern:'thing'})

            ).to.equal( 'https://apiserver.example.org:1024/api/v1/some/thing' );

    });

    it('should link to the current handler', function() {
        var e = new Espresso({
            protocol: 'https',
            hostname: 'apiserver.example.org',
            apiRoot: '/api/v1',
            port: '1024'
        });

        e.resource('/:key/:pattern', function(r1,r2,api){

            return api.linkTo(this);

        });

        e.setSerializer( function(r1, r2, api, v ) {
            expect( v ).to.equal( 'https://apiserver.example.org:1024/api/v1/some/thing' );
        });


        e.dispatchRequest( new Espresso.Request({method:'get', path:'/some/thing'}) );

    });


});
