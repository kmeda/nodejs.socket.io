var expect = require('expect');
var {generateMessage, generateLocationMessage} = require('./message');

describe("generateMessage", ()=>{
  it("Should generate correct message object", ()=>{

      var from = "Admin";
      var text = "Welcome to chat app";
      var res = generateMessage(from, text);

      expect(res.createdAt).toBeA('number');
      expect(res).toInclude({from, text});
  });
});

describe("generateLocationMessage", ()=>{

  it("should generate correct location object", ()=>{

    var from = 'Admin';
    var latitude = 1;
    var longitude = 1;
    var url = `https://www.google.com/maps?q=1,1`;

    var locObj = generateLocationMessage(from, latitude, longitude);

    expect(locObj.createdAt).toBeA('number');
    expect(locObj).toInclude({from,url});
  });


});
