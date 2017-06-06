var should = require('should');
var Registration = require('../lib/registration');

describe('Registration', function () {
    var regResult = {};
    before(function () {
        regResult = Registration.applyForMembership({
            email: 'iramellor@outlook.com',
            password: 'password1',
            confirmPassword: 'password1'
        });
    });

    //happy path
    describe('a valid application', function () {
        it('is successful', function () {
            regResult.success.should.equal(true);
        });
        it('creates a user', function () {
            regResult.user.should.be.defined;
        });
        it('creates a log entry');
        it('sets the user\'s status to approved');
        it('offers a welcome message');
    });

    describe('an empty or null email', function () {
        it('is not successful');
        it('tells the user that the email is required');
    });

    describe('an empty or null password', function () {
        it('is not successful');
        it('tells the user that the password is required');
    });

    describe('password and confirm mismatch', function () {
        it('is not successful');
        it('tells the user that passwords don\'t match');
    });

    describe('email all ready exists', function () {
        it('is not successful');
        it('tells the user that email all ready exists');
    });
});