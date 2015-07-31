var path = require('path');
var webpack = require('webpack');
var node_modules_dir = path.resolve(__dirname, 'node_modules');
var resource_dir = path.resolve(__dirname, 'www/resource');

var config = {
    entry: {
        index_react: resource_dir + '/js/src/index_react.js',
        admin_react: resource_dir + '/js/src/admin_react.js',
        list_react: resource_dir + '/js/src/list_react.js',
        // react: ['react'],
        // jquery: ['jquery'],
        // moment: ['moment']
    },
    output: {
        path: resource_dir + '/js/build',
        filename: '[name].js'
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel',
            exclude: [node_modules_dir]
        }],
        noParse: ['react', 'moment', 'jquery']
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('common.js', ['index_react', 'list_react', 'admin_react'])
    ]
}

module.exports = config;