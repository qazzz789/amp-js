import { expect } from 'chai';
import 'mocha';
import Long = require("long");
import {ByteTools} from "../../src";
import BigNumber from "bignumber.js";
import ByteBuffer = require("bytebuffer");

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

    it('should deconstruct Big number positive 0-127', () => {
        for (let i = 0; i < 128; i++) {
            let temp = ByteTools.deconstructBigNumber(new BigNumber(i));
            // expect(temp.buffer.length).equals(1)
            let num = i.toString(16);
            if (num.length % 2 === 1) {
                num = '0' + num
            }
            expect(temp.toHex().toUpperCase()).equals(num.toUpperCase())
        }
    });

    it('should deconstruct Big number positive 65536', () => {
        let temp = ByteTools.deconstructBigNumber(new BigNumber(65535));
        expect(temp.buffer.length).equals(3)
        expect(temp.toHex().toUpperCase()).equals('00FFFF')
    });

    it('should deconstruct Big number negative 1', () => {
        let temp = ByteTools.deconstructBigNumber(new BigNumber(-1));
        expect(temp.buffer.length).equals(1)
        expect(temp.toHex().toUpperCase()).equals('FF');
    });

    it('should deconstruct Big number negative 255', () => {
        let temp = ByteTools.deconstructBigNumber(new BigNumber(-255));
        expect(temp.buffer.length).equals(2)
        expect(temp.toHex().toUpperCase()).equals('FF01')
    });

    it('should deconstruct Big number positive 255', () => {
        let temp = ByteTools.deconstructBigNumber(new BigNumber(255));
        expect(temp.buffer.length).equals(2)
        expect(temp.toHex().toUpperCase()).equals('00FF')
    });

    it('should deconstruct Big number negative 4097', () => {
        let temp = ByteTools.deconstructBigNumber(new BigNumber(-4097));
        expect(temp.buffer.length).equals(2)
        expect(temp.toHex().toUpperCase()).equals('EFFF')
    });

    it('should deconstruct Big number negative 8093', () => {
        let temp = ByteTools.deconstructBigNumber(new BigNumber(-8093));
        expect(temp.buffer.length).equals(2)
        expect(temp.toHex().toUpperCase()).equals('E063')
    });

    it('should deconstruct Big number negative 65536', () => {
        let temp = ByteTools.deconstructBigNumber(new BigNumber(-65536));
        expect(temp.buffer.length).equals(3)
        expect(temp.toHex().toUpperCase()).equals('FF0000')
    });

    it('should build Big number positive 1', () => {
        let temp = ByteTools.buildBigNumber(ByteBuffer.fromHex('01'));
        expect(temp.toString()).equals('1')
    });

    it('should build Big number positive 65535', () => {
        let temp = ByteTools.buildBigNumber(ByteBuffer.fromHex('00FFFF'));
        expect(temp.toString()).equals('65535')
    });

    it('should build Big number negative 1', () => {
        let temp = ByteTools.buildBigNumber(ByteBuffer.fromHex('FF'));
        expect(temp.toString()).equals('-1')
    });

    it('should build Big number negative 65536', () => {
        let temp = ByteTools.buildBigNumber(ByteBuffer.fromHex('FF0000'));
        expect(temp.toString()).equals('-65536')
    });

    it('should construct amplifyClassID 00', () => {
        expect(ByteTools.amplifyClassID(0)).equals(1073741824);
    });

    it('should construct amplifyClassID 0B', () => {
        expect(ByteTools.amplifyClassID(11)).equals(1073741835);
    });

    it('should construct writeLockClassID 00', () => {
        expect(ByteTools.writeLockClassID(0)).equals(-2147483648);
    });

    it('should construct writeLockClassID 11', () => {
        expect(ByteTools.writeLockClassID(11)).equals(-2147483637);
    });
});