var expect = require('expect');
var {generateMessage} = require('./message');

describe("Generate message", ()=>{

it("Should generate correct message object", ()=>{

    var from = "Admin";
    var text = "Welcome to chat app";
    var res = generateMessage(from, text);

    expect(res.createdAt).toBeA('number');
    expect(res).toInclude({from, text});
});


});
