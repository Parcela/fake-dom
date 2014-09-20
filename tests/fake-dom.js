/*global describe, it */

"use strict";

var expect = require('chai').expect,
    should = require('chai').should(),

    win = require('../fake-dom.js'),
    DOCUMENT = win.document,
    bodyNode = DOCUMENT.body,
    divnode1, divnode2, buttonnode;

describe('matchesSelector', function () {

        before(function() {
            bodyNode.id = 'fakebody';

            divnode1 = DOCUMENT.createElement('div');
            divnode1.id = 'div1';
            divnode1.className = 'class1a class1b';

            divnode2 = DOCUMENT.createElement('div');
            divnode2.id = 'div2';
            divnode2.className = 'class2a class2b';

            buttonnode = DOCUMENT.createElement('button');
            buttonnode.id = 'button3';
            buttonnode.className = 'class3a class3b';

            divnode2.appendChild(buttonnode);
            divnode1.appendChild(divnode2);
            DOCUMENT.body.appendChild(divnode1);
        });

        // Code to execute after the tests inside this describegroup.
        after(function() {
            DOCUMENT.body.removeChild(divnode1);
            delete bodyNode.id;
        });


    it('divnode1 --> "#fakebody .class1a"', function () {
        divnode1.matchesSelector('#fakebody .class1a').should.be.true;
    });

    it('divnode1 --> "div"', function () {
        divnode1.matchesSelector('div').should.be.true;
    });

    it('bodyNode --> "#fakebody"', function () {
        bodyNode.matchesSelector('#fakebody').should.be.true;
    });

    it('bodyNode --> "#div1"', function () {
        bodyNode.matchesSelector('#div1').should.be.false;
    });

    it('divnode1 --> "#div1"', function () {
        divnode1.matchesSelector('#div1').should.be.true;
    });

    it('divnode1 --> "#div1.class1a"', function () {
        divnode1.matchesSelector('#div1.class1a').should.be.true;
    });

    it('divnode1 --> "#div1.noclass"', function () {
        divnode1.matchesSelector('#div1.noclass').should.be.false;
    });

    it('divnode1 --> "#div1.class1a.class1b"', function () {
        divnode1.matchesSelector('#div1.class1a.class1b').should.be.true;
    });

    it('divnode1 --> "#div1 .class1a"', function () {
        divnode1.matchesSelector('#div1 .class1a').should.be.false;
    });

    it('divnode1 --> "#div1 .class2a"', function () {
        divnode1.matchesSelector('#div1 .class2a').should.be.false;
    });

    it('divnode1 --> "#div1 #div2"', function () {
        divnode1.matchesSelector('#div1 #div2').should.be.false;
    });

    it('divnode2 --> "#div1 div"', function () {
        divnode2.matchesSelector('#div1 div').should.be.true;
    });

    it('divnode2 --> "#div1 #div2"', function () {
        divnode2.matchesSelector('#div1 #div2').should.be.true;
    });

    it('divnode2 --> "#div1 #div2.class2a"', function () {
        divnode2.matchesSelector('#div1 #div2.class2a').should.be.true;
    });

    it('divnode2 --> "#div1 div.class2a"', function () {
        divnode2.matchesSelector('#div1 div.class2a').should.be.true;
    });

    it('divnode2 --> "#div1 #div2.noclass"', function () {
        divnode2.matchesSelector('#div1 #div2.noclass').should.be.false;
    });

    it('divnode2 --> "#div1 #div2.class2a.class2b"', function () {
        divnode2.matchesSelector('#div1 #div2.class2a.class2b').should.be.true;
    });

    it('divnode2 --> "#div1 div.class2a.class2b"', function () {
        divnode2.matchesSelector('#div1 div.class2a.class2b').should.be.true;
    });

    it('divnode2 --> "#div1 #div2.class2a.noclass"', function () {
        divnode2.matchesSelector('#div1 #div2.class2a.noclass').should.be.false;
    });

    it('divnode2 --> "#div1 #div2 .class2a"', function () {
        divnode2.matchesSelector('#div1 #div2 .class2a').should.be.false;
    });

    it('divnode2 --> "#div1 #div2 .class3a"', function () {
        divnode2.matchesSelector('#div1 #div2 .class3a').should.be.false;
    });

    it('divnode2 --> "#div1 #div2 #button3"', function () {
        divnode2.matchesSelector('#div1 #div2 #button3').should.be.false;
    });

    it('divnode2 --> "#div1#div2"', function () {
        divnode2.matchesSelector('#div1#div2').should.be.false;
    });

    it('divnode2 --> "#div1#div2.class2a"', function () {
        divnode2.matchesSelector('#div1#div2.class2a').should.be.false;
    });

    it('divnode2 --> "#div1#div2.class2aclass2b"', function () {
        divnode2.matchesSelector('#div1#div2.class2aclass2b').should.be.false;
    });

    it('divnode2 --> "#div1#div2 .class2a"', function () {
        divnode2.matchesSelector('#div1#div2 .class2a').should.be.false;
    });

    it('divnode2 --> "#div1#div2 .class3a"', function () {
        divnode2.matchesSelector('#div1#div2 .class3a').should.be.false;
    });

    it('divnode2 --> "#div1#div2 #button3"', function () {
        divnode2.matchesSelector('#div1#div2 #button3').should.be.false;
    });

    it('buttonnode --> "#div1 #button3"', function () {
        buttonnode.matchesSelector('#div1 #button3').should.be.true;
    });

    it('buttonnode --> "#div1 #button3.class3a"', function () {
        buttonnode.matchesSelector('#div1 #button3.class3a').should.be.true;
    });

    it('buttonnode --> "#div1 #button3.class3a.class3b"', function () {
        buttonnode.matchesSelector('#div1 #button3.class3a.class3b').should.be.true;
    });

    it('buttonnode --> "#div1 #button3.class3a .class3b"', function () {
        buttonnode.matchesSelector('#div1 #button3.class3a .class3b').should.be.false;
    });

    it('buttonnode --> "#div1 #div2 #button3"', function () {
        buttonnode.matchesSelector('#div1 #div2 #button3').should.be.true;
    });

    it('buttonnode --> "#div1 #div2 button"', function () {
        buttonnode.matchesSelector('#div1 #div2 button').should.be.true;
    });

    it('buttonnode --> "#div1 #div2 #button3.class3a"', function () {
        buttonnode.matchesSelector('#div1 #div2 #button3.class3a').should.be.true;
    });

    it('buttonnode --> "#div1 #div2 #button3.class3a.class3b"', function () {
        buttonnode.matchesSelector('#div1 #div2 #button3.class3a.class3b').should.be.true;
    });

    it('buttonnode --> "#div1 #div2 button#button3.class3a.class3b"', function () {
        buttonnode.matchesSelector('#div1 #div2 button#button3.class3a.class3b').should.be.true;
    });

    it('buttonnode --> "#div1 #div2 button.class3a.class3b"', function () {
        buttonnode.matchesSelector('#div1 #div2 button.class3a.class3b').should.be.true;
    });

    it('buttonnode --> "#div1 #div2 #button3.class3a .class3b"', function () {
        buttonnode.matchesSelector('#div1 #div2 #button3.class3a .class3b').should.be.false;
    });

    it('buttonnode --> "#div1 #div2 #button3.class3a .class3b"', function () {
        buttonnode.matchesSelector('#div1 #div2 #button3.class3a .class3b').should.be.false;
    });

    it('divnode1 --> ".class1a"', function () {
        divnode1.matchesSelector('.class1a').should.be.true;
    });

    it('divnode1 --> ".class1a.class1b"', function () {
        divnode1.matchesSelector('.class1a.class1b').should.be.true;
    });

    it('divnode1 --> ".class2a"', function () {
        divnode1.matchesSelector('.class2a').should.be.false;
    });

    it('divnode2 --> ".class1a .class2a"', function () {
        divnode2.matchesSelector('.class1a .class2a').should.be.true;
    });

    it('divnode2 --> ".class1a .class2a.class2b"', function () {
        divnode2.matchesSelector('.class1a .class2a.class2b').should.be.true;
    });

    it('divnode2 --> ".class1a .class2a.noclass"', function () {
        divnode2.matchesSelector('.class1a .class2a.noclass').should.be.false;
    });

    it('divnode2 --> ".class1a.class1b .class2a.class2b"', function () {
        divnode2.matchesSelector('.class1a.class1b .class2a.class2b').should.be.true;
    });

    it('divnode2 --> ".noclass.class1b .class2a.class2b"', function () {
        divnode2.matchesSelector('.noclass.class1b .class2a.class2b').should.be.false;
    });

    it('divnode2 --> ".class1a .class2a .class3a"', function () {
        divnode2.matchesSelector('.class1a .class2a .class3a').should.be.false;
    });

    it('divnode2 --> ".class1a .class2a.class2b .class3a"', function () {
        divnode2.matchesSelector('.class1a .class2a.class2b .class3a').should.be.false;
    });

    it('divnode2 --> ".class1a.class1b .class2a.class2b .class3a"', function () {
        divnode2.matchesSelector('.class1a.class1b .class2a.class2b .class3a').should.be.false;
    });

    it('buttonnode --> ".class1a #div2 .class3a"', function () {
        buttonnode.matchesSelector('.class1a #div2 .class3a').should.be.true;
    });

    it('buttonnode --> ".class1a #div2.class2b .class3a"', function () {
        buttonnode.matchesSelector('.class1a #div2.class2b .class3a').should.be.true;
    });

    it('buttonnode --> ".class1a #div2.class2a.class2b .class3a"', function () {
        buttonnode.matchesSelector('.class1a #div2.class2a.class2b .class3a').should.be.true;
    });

    it('buttonnode --> ".noclass #div2.class2a.class2b .class3a"', function () {
        buttonnode.matchesSelector('.noclass #div2.class2a.class2b .class3a').should.be.false;
    });

    it('buttonnode --> ".class1a #div2.noclass.class2b .class3a"', function () {
        buttonnode.matchesSelector('.class1a #div2.noclass.class2b .class3a').should.be.false;
    });

    it('buttonnode --> ".class1a #div2.class2a.class2b .noclass"', function () {
        buttonnode.matchesSelector('.class1a #div2.class2a.class2b .noclass').should.be.false;
    });

    it('buttonnode --> ".class1a.class1b #div2.class2a .class3a"', function () {
        buttonnode.matchesSelector('.class1a.class1b #div2.class2a .class3a').should.be.true;
    });

    it('buttonnode --> ".class1a.class1b #div2.class2a.class2b .class3a"', function () {
        buttonnode.matchesSelector('.class1a.class1b #div2.class2a.class2b .class3a').should.be.true;
    });

});