const stream = require('getstream');

streamClient = stream.connect(
    process.env.STREAM_API_KEY,
    process.env.STREAM_API_KEY_SECRET
);

module.exports = streamClient;