// let num = (new BigNumber('8615966415'));
// console.log('num', num);
// let Amount_GID = new GroupID(17, 17, 'Amount');
// let Index_GID = new GroupID(20, 20, 'Index');
// let Receiver_GID = new GroupID(18, 18, 'Receiver');
// console.log(group);
// let amount = AC_SingleElement.ts.createFromBigNumber(Amount_GID, num);
// let receiver = AC_SingleElement.ts.createFromString(Receiver_GID, 'bacon123')
// console.log('amount', amount.getElement());
// console.log('receiver', receiver.getElement())

// let index = AC_SingleElement.ts.createFromInt(Index_GID, 45)
// console.log('index', index.getElement());

// let acc: AmpClassCollection = new AmpClassCollection();
//
// acc.addClass(amount);
// acc.addClass(receiver);
// acc.addClass(index);

// let amp: Amplet = acc.serializeToAmplet();
//
// console.log(amp.serializeToBytes().toHex());

// let ag: UnpackedGroup = amp.unpackGroup(Amount_GID);
// let rg: UnpackedGroup = amp.unpackGroup(Receiver_GID);
// let ig: UnpackedGroup = amp.unpackGroup(Index_GID);
//
// let dag = ag.getElementAsBigNumber(0);
// let drg = rg.getElementAsString(0);
// let dig = ig.getElementAsInt(0)
// console.log(dig)

import {GroupID} from "../src/Groups/GroupID";
import {AC_SingleElement} from "../src/Classifications/AC_SingleElement";
import {AC_ClassInstanceIDIsIndex} from "../src/Classifications/AC_ClassInstanceIDIsIndex";
import ByteBuffer = require("bytebuffer");
import {ByteTools} from "../src/ByteTools";
import {AmpClassCollection} from "../src/Classifications/AmpClassCollection";

let lorem1 = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce lacinia tincidunt risus et porttitor. Morbi varius sit amet neque aliquet imperdiet. Etiam eu eros euismod, volutpat ante id, volutpat justo. Integer sit amet massa sodales nibh ultrices auctor. Duis scelerisque ante eget tristique vehicula. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut luctus luctus libero, in rutrum odio malesuada vel. Fusce auctor dolor eros, nec aliquam lectus dignissim et. Vivamus sagittis metus quis neque pretium sagittis. Proin ullamcorper est id nisi porttitor, ut malesuada lacus maximus.";
let lorem2 = "Integer blandit eleifend urna. Aliquam convallis, quam vitae placerat gravida, metus nisl maximus orci, ac ultricies arcu lectus eu nulla. Quisque condimentum velit eu odio imperdiet, quis dapibus velit rhoncus. Nullam efficitur augue a lorem efficitur bibendum. Aenean eget ipsum dictum, commodo leo et, tempor mauris. Donec lobortis ligula a arcu interdum finibus. Vestibulum venenatis dolor nec mauris aliquet, vel aliquam enim venenatis. Sed varius imperdiet mi non posuere. Fusce porttitor, dolor vel cursus iaculis, nibh mi gravida mi, id mattis augue quam sit amet tellus. Proin dui nulla, cursus sit amet augue nec, auctor tincidunt justo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam congue est diam, non euismod velit pretium quis. Phasellus eget varius dolor. Cras sit amet tellus sit amet massa consequat viverra. Nulla sit amet augue id lacus mattis viverra sed sed massa.";
let lorem3 = "In eget pharetra eros, vel pharetra arcu. Sed condimentum massa porttitor nibh porttitor venenatis. Ut malesuada aliquam ipsum sit amet sodales. Suspendisse posuere, augue in facilisis lacinia, neque massa accumsan sapien, euismod efficitur risus risus id felis. Mauris ultricies lacinia mi, sed volutpat nunc suscipit vel. Sed hendrerit, urna porta suscipit fermentum, libero arcu faucibus velit, at blandit mauris ligula et nibh. Aliquam eu sem odio. Integer accumsan nisl sed ornare convallis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec ultricies felis felis, nec venenatis nisi rutrum quis. Ut viverra sodales est ut mattis. Fusce tempus sem et magna convallis bibendum. In tincidunt efficitur odio a pellentesque. Phasellus sollicitudin purus id finibus faucibus.";
let lorem4 = "Mauris tincidunt augue sed nisi viverra vehicula. Etiam rutrum nisl vitae diam tempor, et facilisis sapien consequat. Nunc dictum vitae ex sed posuere. Praesent maximus lacus nisl, eleifend posuere urna vestibulum et. Aliquam eget ligula eget mauris lobortis rhoncus. Morbi at mi sit amet leo convallis posuere vel non risus. Nulla nunc diam, suscipit vitae libero vel, elementum placerat est. Nam tincidunt ligula nec purus congue, in rutrum sapien ultricies. Curabitur finibus quam quis enim consequat, et sagittis turpis hendrerit.";
let lorem5 = "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla sed tempus sapien, blandit laoreet mi. In pellentesque hendrerit dui eget efficitur. Suspendisse facilisis quam vitae dignissim sollicitudin. Duis euismod turpis vel fermentum maximus. Nam non nisl eu augue facilisis placerat. Aenean blandit, dolor eget luctus sodales, tortor lorem tincidunt magna, sed vulputate neque metus ac lacus. Nulla convallis sit amet odio at pharetra.";

// let lorem1 = 'bacon123'
// let lorem2 = 'cheese123'
// let lorem3 = 'pizza123'
// let lorem4 = 'icecream123'
// let lorem5 = 'yogurt123'




console.log(100)
let testGroupID = new GroupID(5, 10, "Test Group")
let testAC = AC_SingleElement.createFromString(testGroupID, "Hi!");

let loremClassID = 555
let loremAC = AC_ClassInstanceIDIsIndex.create(loremClassID, "Lorems Group")

for (let i = 0; i < 10; i++) {
    let input: ByteBuffer;

    if (i % 5 == 0)
    {
        input = ByteTools.deconstructString(lorem1);
    }
    if (i % 5 == 1)
    {
        input = ByteTools.deconstructString(lorem2);
    }
    if (i % 5 == 2)
    {
        input = ByteTools.deconstructString(lorem3);
    }
    if (i % 5 == 3)
    {
        input = ByteTools.deconstructString(lorem4);
    }
    if (i % 5 == 4)
    {
        input = ByteTools.deconstructString(lorem5);
    }

    loremAC.addElement(input);
    input.buffer[0]++;
    loremAC.addElement(input);
    input.buffer[0]++;
    loremAC.addElement(input);
    input.buffer[0]++;
    loremAC.addElement(input);
    input.buffer[0]++;
    loremAC.addElement(input);
    input.buffer[0]++;
    loremAC.addElement(input);
    input.buffer[0]++;
    loremAC.addElement(input);
    input.buffer[0]++;
    loremAC.addElement(input);
    input.buffer[0]++;
    loremAC.addElement(input);
    input.buffer[0]++;
    loremAC.addElement(input);
    input.buffer[0]++;
}

loremAC = AC_ClassInstanceIDIsIndex.create(loremClassID, "Lorems Group 2");

for (let i = 0; i < 10; i++) {
    let input: ByteBuffer;

    if (i % 5 == 0)
    {
        input = ByteTools.deconstructString(lorem1);
    }
    if (i % 5 == 1)
    {
        input = ByteTools.deconstructString(lorem2);
    }
    if (i % 5 == 2)
    {
        input = ByteTools.deconstructString(lorem3);
    }
    if (i % 5 == 3)
    {
        input = ByteTools.deconstructString(lorem4);
    }
    if (i % 5 == 4)
    {
        input = ByteTools.deconstructString(lorem5);
    }

    loremAC.addElement(input);
    input.buffer[0]++;
    loremAC.addElement(input);
    input.buffer[0]++;
    loremAC.addElement(input);
    input.buffer[0]++;
    loremAC.addElement(input);
    input.buffer[0]++;
    loremAC.addElement(input);
    input.buffer[0]++;
    loremAC.addElement(input);
    input.buffer[0]++;
    loremAC.addElement(input);
    input.buffer[0]++;
    loremAC.addElement(input);
    input.buffer[0]++;
    loremAC.addElement(input);
    input.buffer[0]++;
    loremAC.addElement(input);
    input.buffer[0]++;
}

console.log(200)

let testCC = new AmpClassCollection();

testCC.addClass(testAC);
testCC.addClass(loremAC);

let amp = testCC.serializeToAmplet();

console.log(300)

let trailer = ByteBuffer.allocate(5);
trailer.writeByte(0).writeByte(1).writeByte(2).writeByte(3).writeByte(5);

amp.trailer = trailer
console.log(amp.serializeToBytes())
// console.log('amp-------------', amp.unpackClass(loremClassID)[0].getElement(0).toUTF8())
amp = amp.repackSelf()
// console.log('amp*************', amp.unpackClass(loremClassID)[0].getElement(0).toUTF8())
amp = amp.repackSelf()
// console.log('amp*************', amp.unpackClass(loremClassID)[0].getElement(0).toUTF8())
console.log(400)

for (let i = 0; i < 1; i++) {
    amp = amp.repackSelf()

    let loremsGroupList = amp.unpackClass(loremClassID);
    for (let j = 0; j < loremsGroupList.length; j++) {
        let loremsGroup = loremsGroupList[j]
        for (let k = 0; k < loremsGroup.getNumberOfElements() - 1; k++) {
            loremsGroup.addElement(loremsGroup.getElement(0));
            loremsGroup.removeElement(0);
        }
    }
}

amp = amp.repackSelf()

console.log(500)

let loremsGroupList = amp.unpackClass(loremClassID);

for (let i = 0; i < loremsGroupList.length; i++) {
    let loremsGroup = loremsGroupList[i];

    let count = loremsGroup.getNumberOfElements();
    console.log('Lorems:')
    for (let j = 0; j < count; j++) {
        console.log(loremsGroup.getElement(j).toUTF8())
    }
}

try {
    let testString = amp.unpackGroup(testGroupID).getElementAsString(0);
    console.log(testString)
} catch (e) {
    console.log(e)
}