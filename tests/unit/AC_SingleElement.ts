import { expect } from 'chai';
import 'mocha';
import {AC_SingleElement} from "../../src/Classifications/AC_SingleElement";
import {GroupID} from "../../src/Groups/GroupID";
import BigNumber from "bignumber.js";
import {ByteTools} from "../../src/ByteTools";

let group: GroupID;
describe('AC_SingleElement', () => {
    beforeEach(() => {
        group = new GroupID(5,5, 'default');
    });

    it('should create element from BigNumber positive', () => {
        let element = AC_SingleElement.createFromBigNumber(group, new BigNumber(255));
        expect(new BigNumber(element.getElement().toHex(), 16).toString()).equals('255');
    });

    it('should create element from BigNumber negative', () => {
        let element = AC_SingleElement.createFromBigNumber(group, new BigNumber(-100));
        expect(ByteTools.buildBigNumber(element.getElement()).toString()).equals('-100');
    });

    it('should create element from string', () => {
        let ts = 'test.+asdfg%';
        let element = AC_SingleElement.createFromString(group, ts);
        expect(element.getElement().toUTF8()).equals(ts);
    });

    it('should create element from int positive', () => {
        let element = AC_SingleElement.createFromInt(group, 14);
        expect(element.getElement().readInt32(0)).equals(14);
    });

    it('should create element from int negative', () => {
        let element = AC_SingleElement.createFromInt(group, -56);
        expect(element.getElement().readInt32(0)).equals(-56);
    });

    it('should create element from boolean true', () => {
        let element = AC_SingleElement.createFromBoolean(group, true);
        expect(element.getElement().readByte(0) === 1).equals(true);
    });

    it('should create element from boolean false', () => {
        let element = AC_SingleElement.createFromBoolean(group, false);
        expect(element.getElement().readByte(0) === 1).equals(false);
    });
});