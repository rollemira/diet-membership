var assert = require('assert');

var Log = function (args) {
    assert.ok(args.subject && args.entry && args.userId,
        'Need a subject, entry and userId');
    var log = {};

    log.subject = args.subject;
    log.entry = args.entry;
    log.userId = args.userId;
    log.createdAt = new Date();
};

module.exports = Log;