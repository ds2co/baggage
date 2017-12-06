const { CarryOn, Checked, Excessive } = require('../../dist/baggage');

describe('Storage Level Modules', function () {
    describe('CarryOn', function () {
        it('should equal 1', function () {
            expect(CarryOn).to.equal(1);
        });
    });

    describe('Checked', function () {
        it('should equal 2', function () {
            expect(Checked).to.equal(2);
        });
    });

    describe('Excessive', function () {
        it('should equal 3', function () {
            expect(Excessive).to.equal(3);
        });
    });
});