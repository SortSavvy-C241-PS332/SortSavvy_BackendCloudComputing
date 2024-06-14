const { addUserLoginList, updateUserProfile } = require('./handler');

const routes = [
    {
        method: 'POST',
        path: '/users',
        options: {
            payload: {
                output: 'stream',
                parse: true,
                multipart: true
            }
        },
        handler: addUserLoginList,
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