const { Handler, CarryOn, Checked, Excessive } = require('../../dist/baggage');
const { Todo } = require('../mocks/objects');
const reference = new Todo();

describe('Dynamic Modules', function () {
    beforeEach(function () {
        Handler.Claim();
    });

    describe('CarryOn Class', function () {
        beforeEach(function () {
            Handler.Check(Todo);

            var item = require('../../dist/baggage').Todo;
            
            item.username = 'NewUsername';
            item.message = 'This message has changed';
            item.urgency = 1;
        });

        it('should contain updated data', function(){
            var todo = require('../../dist/baggage').Todo;

            expect(todo.username).to.not.equal(reference.username);
            expect(todo.message).to.not.equal(reference.message);
            expect(todo.urgency).to.not.equal(reference.urgency);
            expect(todo.print()).to.not.equal(reference.print());

            expect(todo.username).to.equal('NewUsername');
            expect(todo.message).to.equal('This message has changed');
            expect(todo.urgency).to.equal(1);
            expect(todo.print()).to.equal('NewUsername has a Low urgent message of "This message has changed"');

            expect(localStorage).to.be.an('object').that.is.empty;
            expect(sessionStorage).to.be.an('object').that.is.empty;
        });
    });

    describe('Checked Class', function () {
        beforeEach(function () {
            Handler.Check(Todo, Checked);

            var item = require('../../dist/baggage').Todo;
            
            item.username = 'NewUsername';
            item.message = 'This message has changed';
            item.urgency = 1;
        });

        it('should contain updated data', function(){
            var todo = require('../../dist/baggage').Todo,
                sessionStoreTodo = JSON.parse(sessionStorage.getItem('bg-Todo'));

            expect(todo.username).to.not.equal(reference.username);
            expect(todo.message).to.not.equal(reference.message);
            expect(todo.urgency).to.not.equal(reference.urgency);
            expect(todo.print()).to.not.equal(reference.print());

            expect(todo.username).to.equal('NewUsername');
            expect(todo.message).to.equal('This message has changed');
            expect(todo.urgency).to.equal(1);
            expect(todo.print()).to.equal('NewUsername has a Low urgent message of "This message has changed"');

            expect(sessionStoreTodo).to.be.an('object').that.is.not.empty;
            expect(sessionStoreTodo.username).to.equal(todo.username);
            expect(sessionStoreTodo.message).to.equal(todo.message);
            expect(sessionStoreTodo.urgency).to.equal(todo.urgency);

            expect(localStorage).to.be.an('object').that.is.empty;
        });
    });

    describe('Excessive Class', function () {
        beforeEach(function () {
            Handler.Check(Todo, Excessive);

            var item = require('../../dist/baggage').Todo;
            
            item.username = 'NewUsername';
            item.message = 'This message has changed';
            item.urgency = 1;
        });

        it('should contain updated data', function(){
            var todo = require('../../dist/baggage').Todo,
                localStoreTodo = JSON.parse(localStorage.getItem('bg-Todo'));

            expect(todo.username).to.not.equal(reference.username);
            expect(todo.message).to.not.equal(reference.message);
            expect(todo.urgency).to.not.equal(reference.urgency);
            expect(todo.print()).to.not.equal(reference.print());

            expect(todo.username).to.equal('NewUsername');
            expect(todo.message).to.equal('This message has changed');
            expect(todo.urgency).to.equal(1);
            expect(todo.print()).to.equal('NewUsername has a Low urgent message of "This message has changed"');

            expect(localStoreTodo).to.be.an('object').that.is.not.empty;
            expect(localStoreTodo.username).to.equal(todo.username);
            expect(localStoreTodo.message).to.equal(todo.message);
            expect(localStoreTodo.urgency).to.equal(todo.urgency);

            expect(sessionStorage).to.be.an('object').that.is.empty;
        });
    });
});