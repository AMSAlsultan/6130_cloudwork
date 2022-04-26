
const mongoose = require('mongoose');
const dayjs = require('dayjs');
const axios = require("axios");


//Mongo db client library
//const MongoClient  = require('mongodb');

//Express web service library
const express = require('express')

//used to parse the server response from json to object.
const bodyParser = require('body-parser');

//instance of express and port to use for inbound connections.
const app = express()
const port = 3000

var os = require("os");

var myhostname = os.hostname();

//connection string listing the mongo servers. This is an alternative to using a load balancer. THIS SHOULD BE DISCUSSED IN YOUR ASSIGNMENT.
const connectionString = 'mongodb://localmongo1:27017,localmongo2:27017,localmongo3:27017/NotFLIX?replicaSet=rs0';

setInterval(function () {

  console.log(`Intervals are used to fire a function for the lifetime of an application.`);

}, 3000);




//tell express to use the body parser. Note - This function was built into express but then moved to a seperate package.
app.use(bodyParser.json());

//connect to the cluster
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var Schema = mongoose.Schema;

var usersSchema = new Schema({
  _Id: Number,
  userName: String,
  titleID: Number,
  userAction: String,
  point_interaction: String,
  type_interaction: String,
  dateTime: Date

});

var usersModel = mongoose.model('Client', usersSchema, 'client');



app.get('/', (req, res) => {
  usersModel.find({}, (err, client) => {
    if (err) return handleError(err);
    res.send(JSON.stringify(client))
  })
})

app.post('/', (req, res) => {
  var new_user_instance = new usersModel(req.body);
  new_user_instance.save(function (err) {
    if (err) console.log("what the ");
    res.send(JSON.stringify(req.body))
  });
})



app.put('/', (req, res) => {
  res.send('Got a PUT request at /')
})

app.delete('/', (req, res) => {
  res.send('Got a DELETE request at /')
})

//bind the express web service to the port specified
app.listen(port, () => {
  console.log(`Express Application listening at port ` + port)
})

let nodes = [];

var currentTime = dayjs().format();

var nodeID = Math.floor(Math.random() * (100 - 1 + 1) + 1);
toSend = { "hostname": myhostname, "id": nodeID, "time": currentTime };




setInterval(function () {

  var amqp = require('amqplib/callback_api');


  amqp.connect('amqp://test:test@6130_cloudwork_haproxy_1', function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      var queue = 'hello';


      channel.assertQueue(queue, {
        durable: false
      });

      //channel.sendToQueue(queue, Buffer.from(msg));
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(toSend)));
      console.log(" [x] Sent %s", JSON.stringify(toSend));
    });
    setTimeout(function () {
      connection.close();
      //process.exit(0)
    }, 500);
  });

}, 1000);
setInterval(function () { subscriber() }, 5000);

function subscriber() {

  var amqp = require('amqplib/callback_api');

  amqp.connect('amqp://test:test@6130_cloudwork_haproxy_1', function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }

      var queue = 'hello';

      channel.assertQueue(queue, {
        durable: false
      });

      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

      channel.consume(queue, function (msg) {
        console.log(" [x] Received %s", msg.content.toString());
        // convert the message received into an object
        const nodeRecevied = JSON.parse(msg.content.toString());
        // check if the id and host exits on the array
        const check_id = nodes.some(i => i.id === nodeRecevied.id);
        const check_host = nodes.some(j => j.id === nodeRecevied.hostname);
        // if it doesn't exist it will be push it into the array
        if (!check_id && !check_host && nodes.length < 3) nodes.push(nodeRecevied);
        update_nodes(nodeRecevied);

      }, {
        noAck: true
      });
    });
  });

}


function update_nodes(node) {
  // update the time of the node 
  var now = dayjs().format();
  nodes.find(x => x.id === node.id).time = now;
  console.log("This are the current nodes : ", nodes);

}

setInterval(function () {
  // This will prevent errors. It will only execute if there is at least on variable on the array
  if (typeof nodes !== 'undefined' && nodes.length > 0) {
    // call the method to get the leader
    let currentLeader = set_leader();
    console.log("Id of the leader:", currentLeader.id);
    // set the leader as true and as false the ones that are not the leader
    nodes.forEach(element => {
      if (element.id === currentLeader.id) {
        element.leader = true
      } else element.leader = false;


    });
    // Check if the current node is the leader
    if (toSend.id == currentLeader.id) {
      checkNodes();
    }
  }

}, 6000)

function set_leader() {
  // With .reduce we are going to get the maximun id
  const max = nodes.reduce(function (prev, current) {
    return (prev.id > current.id) ? prev : current
  })
  return max
}

function checkNodes() {
  console.log("You are on the leader")
  // Get the difference of the time and set to stop. The ones that have  been more than 2 minutes stopped.
  const date1 = dayjs();
  nodes.forEach(e => {
    const date2 = e.time
    let difference = date1.diff(date2, 'minute');
    console.log("This is the differnece", difference);
    if (difference >= 2) {
      e.status = "stop";
    }
  });
}




var url = 'http://192.168.56.10:2375';

