module.exports = {
    apps: [
        {
            name: 'test_bot',
            script: 'build/app.js',
            env: {
                COMMON_VARIABLE: 'true',
            },
            env_production: {
                NODE_ENV: 'production',
            },
            output: './logs/out.log',
            error: './logs/error.log',
            log: './logs/combined.outerr.log',
        },
    ],
};