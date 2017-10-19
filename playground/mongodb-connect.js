const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) => {
  if(err){
  return  console.log('Unable to connect mongodb server');
  }
  console.log('conncet to mongodb server');
 db.collection('Todos').insertOne({
    text:'something to do',
    compleated:false
  },(err,result)=>{
    if(err){
      return console.log('Unable to inser todo',err);
    }
    console.log(JSON.stringify(result.ops,undefined,2));
  });

  db.collection('users').insertOne({
    name:'reshab',
    age:23,
    location:'bamra'
  },(err,result)=>{
    if(err){
        return console.log('Unable to inser user',err);
    }
    console.log(JSON.stringify(result.ops,undefined,2));
  });
  db.close();
});
