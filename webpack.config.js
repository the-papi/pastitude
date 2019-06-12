const path = require('path');

module.exports = {
    mode: 'production',
    entry: './resources/js/app/app.js',
    output: {
        filename: 'bundle.min.js',
        path: path.resolve(__dirname, 'static')
    }
};
