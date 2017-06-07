var User = require('../models/user');
var Application = require('../models/application');
var assert = require('assert');
var bcrypt = require('bcrypt-nodejs');
var Log = require('../models/log');
var Emitter = require('events').EventEmitter;
var util = require('util');

var RegResult = function (app) {
    return {
        application: app,
        success: false,
        message: null,
        user: null,
        log: null
    };
};

var Registration = function (db) {
    Emitter.call(this);
    var self = this;
    var continueWith = null;

    var validateInputs = function (app) {
        if (!app.email || !app.password) {
            app.setInvalid('Email and password are required');
            self.emit('invalid', app);
        } else if (app.password !== app.confirmPassword) {
            app.setInvalid('Passwords do not match');
            self.emit('invalid', app);
        } else {
            app.validate();
            self.emit('validated', app);
        }
    };

    var checkIfUserExists = function (app) {
        db.users.exists({email: app.email}, function (err, exists) {
            assert.ok(err === null, err);
            if (exists) {
                app.setInvalid('Email all ready exists');
                self.emit('invalid', app);
            } else {
                self.emit('user-does-not-exist', app);
            }
        });
    };

    var createUser = function (app) {
        var user = new User(app);
        user.status = 'approved';
        user.signInCount = 1;
        //hash the password
        user.hashedPassword = bcrypt.hashSync(app.password);
        //save
        db.users.save(user, function (err, newUser) {
            assert.ok(err === null, err);
            app.user = newUser;
            self.emit('user-created', app);
        });
    };

    var addLogEntry = function (app) {
        var log = new Log({
            subject: 'Registration',
            userId: app.user.id,
            entry: 'Successfully registered'
        });
        db.logs.save(log, function (err, newLog) {
            assert.ok(err === null, err);
            app.log = newLog;
            self.emit('log-created', app);
        });
    };

    self.applyForMembership = function (args, next) {
        continueWith = next || function () {};
        var app = new Application(args);
        self.emit('application-received', app);
    };

    var registrationOk = function (app) {
        var regResult = new RegResult(app);
        regResult.success = true;
        regResult.message = 'Welcome!';
        regResult.user = app.user;
        regResult.log = app.log;
        continueWith(null, regResult);
    };

    var registrationNotOk = function (app) {
        var regResult = new RegResult(app);
        regResult.success = false;
        regResult.message = app.message;
        continueWith(null, regResult);
    };

    //event wiring
    self.on('application-received', validateInputs);
    self.on('validated', checkIfUserExists);
    self.on('user-does-not-exist', createUser);
    self.on('user-created', addLogEntry);
    self.on('log-created', registrationOk);

    self.on('invalid', registrationNotOk);

    return self;
};

util.inherits(Registration, Emitter);
module.exports = Registration;