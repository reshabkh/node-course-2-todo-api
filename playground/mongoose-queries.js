var {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
var id = '59e81a523f5877279c2cbae3';

/*if(!ObjectId.isValid(id)) {
  consle.log('id is not valid')
}

Todo.find({
  _id : id
}).then((todos) => {
  console.log('Todos',todos);
});

Todo.findOne({
  _id : id
}).then((todo)=>{
  console.log('Todo',todo);
});

Todo.findById(id).then((todo)=>{
  if(!todo){
    return console.log('id not found');
  }
  console.log('Todo by id',todo);
}).catch((e)=>console.log(e));*/

User.findById(id).then((user) => {
  if(!user){
  return  console.log('user id not found');
  }
  console.log(JSON.stringify(user,undefined,2));
}).catch((e) => console.log(e));
