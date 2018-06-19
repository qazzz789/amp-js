import { expect } from 'chai';
import 'mocha';
import {HeadlessPrefixedAmplet} from "../../src";
import ByteBuffer = require("bytebuffer");

let hpa: HeadlessPrefixedAmplet;
describe('HeadlessPrefixedAmplet', () => {
    beforeEach(() => {
        hpa = HeadlessPrefixedAmplet.createFromHeadlessPrefixedAmplet()
    });

    it('should create element from string', () => {
        let ts = 'com.ampex.amperanet.packets.Ping';
        hpa.addElementString(ts);
        expect(hpa.getNextElement().toUTF8()).equals(ts);
    });

    it('should create 2 elements from strings', () => {
        let ts = 'bacon';
        let tt = 'cheese';
        hpa.addElementString(ts);
        hpa.addElementString(tt);
        expect(hpa.getNextElement().toUTF8()).equals(ts);
        expect(hpa.getNextElement().toUTF8()).equals(tt);
    });

    it('should check next element empty set', () => {
        expect(hpa.hasNextElement()).equals(false);
    });

    it('should check next element set of 1', () => {
        let ts = 'bacon';
        hpa.addElementString(ts);
        expect(hpa.hasNextElement()).equals(true);
    });

    it('should check next element set of 1 and not have a second element', () => {
        let ts = 'bacon';
        hpa.addElementString(ts);
        expect(hpa.hasNextElement()).equals(true);
        expect(hpa.getNextElement().toUTF8()).equals(ts);
        expect(hpa.hasNextElement()).equals(false);
    });

    it('should check next element set of 2 and not have a third element', () => {
        let ts = 'bacon';
        let tt = 'cheese';
        hpa.addElementString(ts);
        hpa.addElementString(tt);
        expect(hpa.hasNextElement()).equals(true);
        expect(hpa.getNextElement().toUTF8()).equals(ts);
        expect(hpa.hasNextElement()).equals(true);
        expect(hpa.getNextElement().toUTF8()).equals(tt);
        expect(hpa.hasNextElement()).equals(false);
    });

    it('should deconstruct hex string to elements', () => {
        const b = ByteBuffer.fromHex('0129636f6d2e616d7065782e616d706572616e65742e7061636b6574732e5554584f446174615374617274010800000000000000000100');
        hpa = HeadlessPrefixedAmplet.createFromBytes(b);
        let n = hpa.getNextElement();
        let crc = hpa.getNextElement();
        let p = hpa.getNextElement();
        expect(p.buffer.length).equals(0)
    })
});
