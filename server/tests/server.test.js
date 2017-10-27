var {ObjectId} = require('mongodb');

const expect = require('expect');
const request = require('supertest');


const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos,populateTodos,users,populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('Post /todos',()=>{
  it('should create a new todo',(done) => {
    var text = 'test todo text';

  request(app)
    .post('/todos')
    .set('x-auth',users[0].tokens[0].token)
    .send({text})
    .expect(200)
    .expect((res)=>{
      expect(res.body.text).toBe(text);
    })
    .end((err,res) => {
      if(err){
        return done(err);
      }
      Todo.find().then((todos)=>{
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e) => done());
    });
  });
  it('should not create todo with invalid data',(done) => {
  request(app)
    .post('/todos')
    .set('x-auth',users[0].tokens[0].token)
    .send({})
    .expect(400)
    .end((err,res) =>{
      if(err){
        return done(err);
      }
      Todo.find().then((todos)=>{
        expect(todos.length).toBe(0);
        done();
      }).catch((e) => done());
    });
});
});

describe('GET /todos',()=>{
  it('should get all todos',(done)=>{
    request(app)
      .get('/todos')
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /todos/:id',()=>{
  it('should return todo doc',(done) =>{
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });
  it('should not return todo doc created by other user',(done) =>{
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth',users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
  it('it should return 404 if todo not found',(done) =>{
    var hexId = new ObjectId().toHexString();

    request(app)
      .get(`/todos/${hexId}`)
      .set('x-auth',users[0].tokens[0].token)
      .expect(404)
      .end(done)
  });
  it('it should return 404 for invalid id',(done) =>{
    request(app)
      .get('/todos/1224')
      .set('x-auth',users[0].tokens[0].token)
      .expect(404)
      .end(done)
  });
});

describe('DELETE /todos/:id',() => {
  it('should reamove a todo',(done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth',users[1].tokens[0].token)
      .expect(200)
      .expect((res)=> {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err,res) => {
        if(err){
          return done(err);
        }
        Todo.findById(hexId).then((todo) =>{
          expect(todo).toBeTruthy();
          done();
        }).catch((e)=>done(e));
      });
  });
  it('should not remove a todo which is not belongs to that user',(done) => {
    var hexId = todos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth',users[1].tokens[0].token)
      .expect(404)
      .end((err,res) => {
        if(err){
          return done(err);
        }
        Todo.findById(hexId).then((todo) =>{
          expect(todo).toNotExist();
          done();
        }).catch((e)=>done(e));
      });
  });

  it('it should return 404 if todo not found',(done) => {
    var hexId = new ObjectId().toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth',users[1].tokens[0].token)
      .expect(404)
      .end(done)
  });

  it('it shuld return 404 if id is not valid',(done) => {
    request(app)
      .delete('/todos/1224')
      .set('x-auth',users[1].tokens[0].token)
      .expect(404)
      .end(done)
  });

});
describe('PATCH /todos/:id',() =>{
  it('should update the todo',(done) =>{
    var hexId = todos[0]._id.toHexString();
    var text = 'Hello world!';

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth',users[0].tokens[0].token)
      .send({
        completed:true,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);

  });
  it('should Not update the todo that created by other users',(done) =>{
    var hexId = todos[0]._id.toHexString();
    var text = 'Hello world!';

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth',users[1].tokens[0].token)
      .send({
        completed:true,
        text
      })
      .expect(404)
      .end(done);

  });
  it('should clear the completedAt when todo is not completed',(done)=>{
    var hexId = todos[1]._id.toHexString();
    var text = 'Hello reshab lets go and have some cofee!';

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth',users[1].tokens[0].token)
      .send({
        completed:false,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
  });
});

describe('GET /users/me',()=>{
  it('should return user if authenticated',(done) => {
    request(app)
      .get('/users/me')
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .expect((res) =>{
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });
  it('should return 401 if user not authenticated ',(done) =>{
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res)=>{
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});
describe('POST /users',() => {
  it('should create a user',(done) => {
    var email = 'abc@pepwash.in';
    var password = 'reshab123';

    request(app)
      .post('/users')
      .send({email,password})
      .expect(200)
      .expect((res)=>{
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end(done);

      /*.end((err) => {
        if(err){
          return done(err);
        }
        User.findOne({email}).then((user)=>{
          expect(user).toBeTruthy();
          expect(user.password).toNotBe(password);
          done();
        });*/
      //});
  });
  it('should return validation error if request invalid',(done)=>{
    request(app)
      .post('/users')
      .send({
         email : 'xyz',
         password : '123'
      })
      .expect(400)
      .end(done);
  });
  it('should not create user if email is in use',(done)=>{
    request(app)
      .post('/users')
      .send({
         email : users[0].email,
         password : 'password123'
      })
      .expect(400)
      .end(done);
  });

});
describe('POST /users/login',()=>{
  it('it should login user and return authenticate token',(done)=>{
      request(app)
        .post('/users/login')
        .send({
          email:users[1].email,
          password:users[1].password
        })
        .expect(200)
        .expect((res)=>{
          expect(res.header['x-auth']).toBeTruthy();
        })
        .end((err,res)=>{
          if(err){
            return done(err);
            }
            User.findById(users[1]._id).then((user)=>{
              expect(user.tokens[1]).toInclude({
                access : 'auth',
                token : res.header['x-auth']
              });
              done();
            }).catch((e)=>done(e));
        });
  });
  it('should reject invalid login',(done)=>{
    request(app)
      .post('/users/login')
      .send({
        email:users[1].email,
        password:users[1].password + '1'
      })
      .expect(400)
      .expect((res)=>{
        expect(res.header['x-auth']).toNotExist();
      })
      .end((err,res)=>{
        if(err){
          return done(err);
          }
          User.findById(users[1]._id).then((user)=>{
            expect(user.tokens.length).toBe(1);
            done();
          }).catch((e)=>done(e));
      });
  });
});
describe('DELETE /users/me/token',()=>{
  it('should remove auth token on logout',(done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .end((err,res)=>{
        if(err){
          return done(err);
        }
        User.findById(users[0]._id).then((user)=>{
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});
