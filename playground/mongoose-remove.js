var {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

/*Todo.remove({}).then((result) => {
  console.log(result);
});*/

Todo.findByIdAndRemove('59eeda33934e9741c5f97a9e').then((docs) => {
  console.log(docs);
});

/*Todo.findOneAndRemove(_id:).then((docs) => {

});*/
