var {ObjectId} = require('mongodb');

const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id : new ObjectId(),
  text : 'whats up'
},{
  _id : new ObjectId(),
  text: 'second wahts up',
  completed: true,
  completedAt: 333
}];

beforeEach((done) => {
  Todo.remove({}).then(()=> {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('Post /todos',()=>{
  it('should create a new todo',(done) => {
    var text = 'test todo text';

  request(app)
    .post('/todos')
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

describe('POST /todos',()=>{
  it('should get all todos',(done)=>{
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res)=>{
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id',()=>{
  it('should return todo doc',(done) =>{
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });
  it('it should return 404 if todo not found',(done) =>{
    var hexId = new ObjectId().toHexString();

    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done)
  });
  it('it should return 404 for invalid id',(done) =>{
    request(app)
      .get('/todos/1224')
      .expect(404)
      .end(done)
  });
});

describe('DELETE /todos/:id',() => {
  it('should reamove a todo',(done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res)=> {
        expect(res.body.todo._id).toBe(hexId);
      })
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
      .expect(404)
      .end(done)
  });

  it('it shuld return 404 if id is not valid',(done) => {
    request(app)
      .delete('/todos/1224')
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
      .send({
        completed:true,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        //expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);

  });
  it('should clear the completedAt when todo is not completed',(done)=>{
    var hexId = todos[1]._id.toHexString();
    var text = 'Hello reshab lets go and have some cofee!';

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        completed:false,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        //expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
  });
})
