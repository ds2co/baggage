const { Handler, CarryOn, Checked, Excessive } = require('../../dist/baggage');
const { Todo } = require('../mocks/objects');
const reference = new Todo();

describe('Handler Module', function () {
    beforeEach(function () {
        // Clear out data
        Handler.Claim();
        sessionStorage.clear();
        localStorage.clear();
    });

    describe('Check function', function () {
        it('should default to CarryOn', function () {
            Handler.Check(Todo);
            var item = require('../../dist/baggage').Todo;

            expect(item.username).to.equal(reference.username);
            expect(item.message).to.equal(reference.message);
            expect(item.urgency).to.equal(reference.urgency);
            expect(item.print()).to.equal(reference.print());
            expect(localStorage).to.be.an('object').that.is.empty;
            expect(sessionStorage).to.be.an('object').that.is.empty;
        });

        it('should add CarryOn class', function () {
            Handler.Check(Todo, CarryOn);
            var item = require('../../dist/baggage').Todo;

            expect(item.username).to.equal(reference.username);
            expect(item.message).to.equal(reference.message);
            expect(item.urgency).to.equal(reference.urgency);
            expect(item.print()).to.equal(reference.print());
            expect(localStorage).to.be.an('object').that.is.empty;
            expect(sessionStorage).to.be.an('object').that.is.empty;
        });

        it('should add Checked class to registry and set data in sessionStorage', function () {
            Handler.Check(Todo, Checked);
            var item = require('../../dist/baggage').Todo,
                sessionItem = JSON.parse(sessionStorage.getItem('bg-Todo'));

            expect(item.username).to.equal(reference.username);
            expect(item.message).to.equal(reference.message);
            expect(item.urgency).to.equal(reference.urgency);
            expect(item.print()).to.equal(reference.print());
            expect(sessionItem.username).to.equal(reference.username);
            expect(sessionItem.message).to.equal(reference.message);
            expect(sessionItem.urgency).to.equal(reference.urgency);
            expect(localStorage).to.be.an('object').that.is.empty;
        });

        it('should add Excessive class to registry and set data in localStorage', function () {
            Handler.Check(Todo, Excessive);
            var item = require('../../dist/baggage').Todo,
                localItem = JSON.parse(localStorage.getItem('bg-Todo'));

            expect(item.username).to.equal(reference.username);
            expect(item.message).to.equal(reference.message);
            expect(item.urgency).to.equal(reference.urgency);
            expect(item.print()).to.equal(reference.print());
            expect(localItem.username).to.equal(reference.username);
            expect(localItem.message).to.equal(reference.message);
            expect(localItem.urgency).to.equal(reference.urgency);
            expect(sessionStorage).to.be.an('object').that.is.empty;
        });

        it('should throw TypeError when added incorrect object', function () {
            expect(function () {
                Handler.Check(reference)
            }).to.throw(TypeError);
        });

        it('should throw Error if class name is already registered', function () {
            Handler.Check(Todo);

            expect(function () {
                Handler.Check(Todo);
            }).to.throw(Error);
        });

        it('should throw TypeError if store level is not CarryOn(1), Checked(2), or Excessive(3)', function () {
            expect(function () {
                Handler.Check(Todo, 6);
            }).to.throw(TypeError);
        });
    });

    describe('Claim function', function () {
        it('should remove all CarryOn items', function () {
            Handler.Check(Todo, CarryOn);
            var checked = require('../../dist/baggage').Todo;

            expect(checked).to.be.an('object').that.is.not.empty;

            Handler.Claim();

            var claimed = require('../../dist/baggage').Todo;

            expect(claimed).to.be.undefined;
            expect(localStorage).to.be.an('object').that.is.empty;
            expect(sessionStorage).to.be.an('object').that.is.empty;
        });

        it('should remove all Checked items', function () {
            Handler.Check(Todo, Checked);
            var checked = require('../../dist/baggage').Todo;

            expect(checked).to.be.an('object').that.is.not.empty;
            expect(sessionStorage).to.be.an('object').that.is.not.empty;

            Handler.Claim();

            var claimed = require('../../dist/baggage').Todo;

            expect(claimed).to.be.undefined;
            expect(localStorage).to.be.an('object').that.is.empty;
            expect(sessionStorage).to.be.an('object').that.is.empty;
        });

        it('should remove all Excessive items', function () {
            Handler.Check(Todo, Excessive);
            var checked = require('../../dist/baggage').Todo;

            expect(checked).to.be.an('object').that.is.not.empty;
            expect(localStorage).to.be.an('object').that.is.not.empty;

            Handler.Claim();

            var claimed = require('../../dist/baggage').Todo;

            expect(claimed).to.be.undefined;
            expect(localStorage).to.be.an('object').that.is.empty;
            expect(sessionStorage).to.be.an('object').that.is.empty;
        });
    });
});
