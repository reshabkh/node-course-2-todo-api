const {MongoClient,ObjectId} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) => {
  if(err){
  return  console.log('Unable to connect mongodb server');
  }
  console.log('conncet to mongodb server');
  //deleteMany
  /*db.collection('Todos').deleteMany({text:'Eat lunch'}).then((result) => {
    console.log(result);
  });*/
  //deleteone
  /*db.collection('Todos').deleteOne({text:'Eat lunch'}).then((result)=>{
    console.log(result);
  });*/
  //findOneAndDelete
  /*db.collection('Todos').findOneAndDelete({text:'Eat lunch'}).then((result)=>{
    console.log(result);
  })*/
  /*db.collection('users').deleteMany({name:'peru'}).then((result)=>{
    console.log(result);
  });*/
  db.collection('users').deleteOne({name:'reshab'}).then((result)=>{
    console.log(result);
  })
//db.close();
});
