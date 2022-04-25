
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

var clientsSchema = new Schema({
  AccountId: Number,
  userName: String,
  title_id: Number,
  userAction: String,
  point_interaction: String,
  type_interaction: Number,
  date_time: Date
});

var clientsSchemal = mongoose.model('Client', clientsSchema, 'Client');



app.get('/', (req, res) => {
  clientsModel.find({}, 'Get users data', (err, client) => {
    if (err) return handleError(err);
    res.send(JSON.stringify(client))
  })
})

app.post('/', (req, res) => {
  var awesome_instance = new SomeModel(req.body);
  awesome_instance.save(function (err) {
    if (err) res.send('Error');
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

var currentTime = dayjs();

var nodeID = Math.floor(Math.random() * (100 - 1 + 1) + 1);
toSend = { "hostname": myhostname, "status": "alive", "id": nodeID, "time": currentTime };




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
setInterval(function () { sub() }, 5000);

function sub() {

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
        const nodeRecevied = JSON.parse(msg.content.toString());


        // update the time of the node, we are using moment library, since it is quite useful for time
        if (nodes.some(i => i.nodeID === container.nodeID) && nodes.some(j => j.hostname === container.hostname)) {
          let check = nodes.map(i => i.id).includes(nodeRecevied.id);
          console.log(check);

        }
        else {
          // if it doesnt exist we will update the node
          nodes.push(nodeRecevied);

        }
        print_nodes();

      }, {
        noAck: true
      });
    });
  });

}


function print_nodes() {

  console.log("This are the current nodes : ", nodes);

}





var url = 'http://192.168.56.10:2375';









