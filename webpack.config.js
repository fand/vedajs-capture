const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
        path: path.resolve(__dirname, 'docs'),
        filename: 'bundle.js',
    },
    devServer: {
        contentBase: path.join(__dirname, 'docs'),
    },
    module: {
        rules: [
            { test: /\.js$/, loader: 'babel-loader' },
            { test: /\.css$/, loader: ['style-loader', 'css-loader'] },
            {
                test: /\.(glsl|frag|vert)$/,
                loader: 'raw-loader',
            },
        ],
    },
    externals: [{
        CCapture: true,
    }],
};
