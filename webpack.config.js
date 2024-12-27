const path = require('path');

module.exports = {
    entry: './src/index.js', // Entry point
    output: {
        filename: 'bundle.js', // Output file name
        path: path.resolve(__dirname, 'dist') // Output directory
    },
    mode: 'development', // Set mode to development
    devServer: {
        static: path.resolve(__dirname, 'dist'), // Serve files from the 'dist' directory
        port: 8080, // Optional: specify a custom port (default is 8080)
        open: true, // Automatically open the browser
        hot: true, // Enable Hot Module Replacement
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader', // Optional: Transpile JavaScript with Babel
            },
        ],
    },
    resolve: {
        alias: {
            phaser: path.resolve(__dirname, 'node_modules/phaser'),
        },
    },
};