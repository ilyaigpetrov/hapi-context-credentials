var Hapi = require('hapi');
var Path = require('path');

var server = new Hapi.Server();
server.connection({ port: 4000 });

server.views({
    engines: {
        hbs: require('handlebars'),
        jade: require('jade')
    },
    path: __dirname,
    isCached: false
});

server.register([
    {
        register: require('../../index'),       // hapi-context-credentials
    }, {
        register: require('hapi-auth-basic')
    }
], function (err) {

    if (err) {
        throw err;
    }

    var validateFunc = function (username, password, callback) {

        // Just authenticate everyone and store username
        // in credentials

        callback(null, true, {
            username: username
        });
    };

    server.auth.strategy('simple', 'basic', {
        validateFunc: validateFunc
    });

    server.route([{
            config: {
                auth: 'simple'
            },
            method: 'GET',
            path: '/hbs',
            handler: function(request, reply) {

                reply.view('example.hbs');          // Handlebars example
            }
        }, {
            config: {
                auth: 'simple'
            },
            method: 'GET',
            path: '/jade',
            handler: function(request, reply) {

                reply.view('example.jade');         // Jade example
            }
        }
    ]);

    server.start(function() {
        console.log('Started server');
    });
});