const Hapi = require('@hapi/hapi');
const Joi = require('@hapi/joi');
const { getScanQty, updateScanQty } = require('./db');

const init = async () => {
    const server = Hapi.server({
        port: 8000,
        host: '0.0.0.0'
    });

    // Route untuk GET jumlah barcode yang discan oleh user
    server.route({
        method: 'GET',
        path: '/scan/{user_id}',
        handler: async (request, h) => {
            const { user_id } = request.params;
            const count = await getScanQty(user_id);
            return { user_id, count };
        }
    });

    // Route untuk PUT data scan baru
    server.route({
        method: 'PUT',
        path: '/scan/{user_id}',
        handler: async (request, h) => {
            const { user_id } = request.params;
            const { waste } = request.payload;
            const result = await updateScanQty(user_id, waste);
            return { user_id, waste, result };
        },
        options: {
            validate: {
                payload: Joi.object({
                    waste: Joi.string().required()
                })
            }
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();