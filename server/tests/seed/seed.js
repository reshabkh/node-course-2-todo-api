const {ObjectId} = require('mongodb');
const {Todo} = require('./../../models/todo.js');
const {User} = require('./../../models/user.js');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectId();
const userTwoId = new ObjectId();

const users = [{
  _id:userOneId,
  email:'reshab@pepwash.in',
  password:'hellouserone',
  tokens :[{
    access:'auth',
    token:jwt.sign({_id:userOneId,access:'auth'},'abc123').toString()
  }]
},{
  _id:userTwoId,
  email:'vivek@pepwash.in',
  password:'hellousertwo'
}];


const todos = [{
  _id : new ObjectId(),
  text : 'whats up'
},{
  _id : new ObjectId(),
  text: 'second wahts up',
  completed: true,
  completedAt: 333
}];

const populateTodos = (done) => {
  Todo.remove({}).then(()=> {
    return Todo.insertMany(todos);
  }).then(() => done());
};

const populateUsers = (done) =>{
  User.remove({}).then(()=>{
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne,userTwo])
  }).then(()=>done());
};
module.exports = {todos,populateTodos,users,populateUsers};
