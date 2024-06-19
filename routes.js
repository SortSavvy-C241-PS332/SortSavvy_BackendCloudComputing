const { registerUser, loginUser, getUser, updateUserProfile, updateUserPassword } = require('./handler');

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
        method: 'GET',
        path: '/users/{id}',
        handler: getUser,
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
    {
        method: 'PUT',
        path: '/users/{id}/password',
        options: {
            payload: {
                output: 'stream',
                parse: true,
                multipart: true
            }
        },
        handler: updateUserPassword,
    },
];

module.exports = routes;
