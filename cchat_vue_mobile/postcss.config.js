// postcss.config.js
module.exports = {
    plugins: {
        //px转 viewport
        'postcss-px-to-viewport': {
            viewportWidth: 375,
        },
    },
};