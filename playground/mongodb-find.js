//const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectId} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) => {
  if(err){
  return  console.log('Unable to connect mongodb server');
  }
  console.log('conncet to mongodb server');

  db.collection('users').find({name:'peru'}).toArray().then((docs)=>{
    console.log('Todos');
    console.log(JSON.stringify(docs,undefined,2));
  },(err)=>{
    console.log('unable to fetch todo',err);
  });
/*  db.collection('Todos').find().count().then((count)=>{
    console.log(`Todo count :${count}`);
    //console.log(JSON.stringify(docs,undefined,2));
  },(err)=>{
    console.log('unable to fetch todo',err);
  });*/

  db.close();
});
