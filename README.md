Readme file to run and test my code.


Create a templete with docker compose installed on it and git clone the code.
You need to install npm and then cd to the src file of mongo.js, there you need to run the following command npm install express mongoose amqplib axios dayjs

Then on the folder where is the docker.yaml file run the docker compose up. After the rabbit containers are set, you will need to create an new user as user:test password:test and set it up as administrator.
Change the name of the url on the sub and pub method. It should be the name of the container with haproxy.
You can save data with the rest client tool of VS. You need to use the url of your vm and the port :81.
You can kill a container, and if you are on the leader, this will change the status of the dead container.
The best way to test the code is do compose up, check the node that is with the highest id. Then, sudo docker-compose up| grep node and the number of the node with the highest id. Like that you will see the outuput of the leader.