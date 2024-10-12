// Export routing function
module.exports = function (api) {
    // Public routes (no authentication required)
    api.use('/public', require('./public/login'));  // Make sure this line is correct
    api.use('/public', require('./public/posts'));
    api.use('/public', require('./public/authors'));
    api.use('/public', require('./public/artists'));
    api.use('/public', require('./public/albums'));

    // Import the verifyToken middleware for private routes
    const { verifyToken } = require('../middleware');

    // Private routes that require token authentication
    api.use('/notes', verifyToken, require('./private/notes'));
    api.use('/posts', verifyToken, require('./private/posts'));
    api.use('/resources', verifyToken, require('./private/resources'));
    api.use('/todos', verifyToken, require('./private/todos'));
    api.use('/users', verifyToken, require('./private/users'));
    api.use('/visitors', verifyToken, require('./private/visitors'));
    api.use('/images', verifyToken, require('./private/images'));
    api.use('/upload', verifyToken, require('./private/upload'));
    api.use('/workouts', verifyToken, require('./private/workouts'));
    api.use('/exercises', verifyToken, require('./private/exercises'));
    api.use('/settings', verifyToken, require('./private/settings'));
    api.use('/messages', verifyToken, require('./private/messages'));
    api.use('/tickets', verifyToken, require('./private/tickets'));
};
