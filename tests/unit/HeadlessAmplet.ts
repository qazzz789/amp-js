import {HeadlessAmplet} from "../../src";
import {expect} from "chai";

let hp: HeadlessAmplet;
describe('HeadlessAmplet', () => {
    beforeEach(() => {
        hp = HeadlessAmplet.createFromHeadlessAmplet()
    });

    it('should construct boolean true', () => {
        hp.addElementBoolean(true);
        expect(hp.getNextBoolean()).equals(true);
    });

    it('should construct integer', () => {
        hp.addElementInt(65535);
        expect(hp.getNextInt()).equals(65535);
    });
});