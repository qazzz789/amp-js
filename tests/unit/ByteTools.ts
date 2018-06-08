import { expect } from 'chai';
import 'mocha';
import Long = require("long");
import {ByteTools} from "../../src";
import BigNumber from "bignumber.js";

describe('ByteTools', () => {
    it('should construct short', () => {
        expect(ByteTools.buildShort(0,5)).equals(5)
    });

    it('should construct Long', () => {
        expect(ByteTools.buildLong(0,0,0,0,0,0,0,10).toString()).equals(new Long(10).toString())
    });

    it('should deconstruct Long', () => {
        let temp = ByteTools.deconstructLong(new BigNumber(30));
        expect(ByteTools.buildBigNumber(temp).toString()).equals('30')
    });

    it('should deconstruct Long format positive', () => {
        let temp = ByteTools.deconstructLong(new BigNumber(30));
        expect(temp.buffer.length).equals(8)
    });

    it('should deconstruct Long format negative', () => {
        let temp = ByteTools.deconstructLong(new BigNumber(-30));
        expect(temp.buffer.length).equals(8)
    });
});