const { registerUser, loginUser, updateUserProfile } = require('./handler');

const routes = [
    {
        method: 'POST',
        path: '/register',
        options: {
            payload: {
                output: 'data',
                parse: true
            }
        },
        handler: registerUser,
    },
    {
        method: 'POST',
        path: '/login',
        options: {
            payload: {
                output: 'data',
                parse: true
            }
        },
        handler: loginUser,
    },
    {
        method: 'PUT',
        path: '/users/{id}',
        options: {
            payload: {
                output: 'stream',
                parse: true,
                multipart: true
            }
        },
        handler: updateUserProfile,
    },
];

module.exports = routes;
