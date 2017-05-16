const expect = require('expect');
const {Users} = require('./users');

describe("Users", ()=>{
var users;
  beforeEach(()=>{
    users = new Users();

    users.users = [{
      id: '1',
      name: 'Mike',
      room: 'Node'
    }, {
      id: '2',
      name: 'Jen',
      room: 'React'
    }, {
      id: '3',
      name: 'Julie',
      room: 'Node'
    }];
  });

  it('should add new user', ()=>{
    var users = new Users();
    var user = {id: 123, name: 'John', room: 'general'};
    var resUser = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });

  it("should return names for node course", ()=>{
    var userList = users.getUserList('Node');

    expect(userList).toEqual(['Mike', 'Julie']);
  });

  it("should return names for react course", ()=>{
    var userList = users.getUserList('React');

    expect(userList).toEqual(['Jen']);
  });

  it("should find user", ()=>{
    var userId = '2';
    var user = users.getUser(userId);

    expect(user.id).toBe(userId);
  });

  it("should not find user", ()=>{
    var userId = '4';
    var user = users.getUser(userId);
    expect(user).toNotExist();
  });

  it('should remove a user', ()=>{
    var userId = '1';
    var user = users.removeUser(userId);

    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });

  it('should not remove a user', ()=>{
    var userId = '4';
    var user = users.removeUser(userId);

    expect(user).toNotExist();
    expect(users.users.length).toBe(3);
  });

});
