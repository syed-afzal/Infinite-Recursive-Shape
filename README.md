# Infinite recursive shape

## Overview

It is the recursive square drawing application, which consists of 3 input paramters __Width__, __Height__ and __Padding__ wth some validations.
I used [Vue JS](https://vuejs.org/) to make front-end which is a modern and demanding JavaScript front-end framework.

Live Demo of [App](https://recursive-square-afzal.herokuapp.com/)

CI/CD is impemented, if you pushed any commit on branch __master__ it will auto deploy for you after performing integrations.


## Validations on Input

Validations on input fields are as follows: 

- Width value should be even and greater or equal to 20 and less than or equal 300
- Height value should also be even and greater or equal to 20 and less than or equal 300
Padding value should be even and greater or equal to 4 and less than or equal 60

 
It's sound good and interesting  :ok_hand: , so let's start how it runs :runner:

## Prerequisite

For this application to work, [Node](https://nodejs.org/en/) needs to be installed on your local(host) machine.

## How to Start it :question:

Steps to start app are as follows:

- Clone the repo.
- Go to root of the repo.
- Run `npm i` it will install all dependencies. 
- Run `npm start`.
- It will start your application and you will see this on the command line 
``Server is up on port 3003`` 
- Go to the browser and hit ``localhost:30030``, it will open your application

## How to test the application works fine :question:

:white_check_mark: Input your desired height, width and padding then press __submit__ button to see the ouptut squares.

## Some screenshots fot test cases

- (Width: 20, Height:40, padding: 6)

  ![image](20_40_6.png)

- (Width: 60, Height:60, padding: 10)

  ![image](60_60_10.png)

- (Width: 80, Height:100, padding: 20)

  ![image](80_100_20.png)


- The first line tells Docker to use another Node image from the [DockerHub](https://hub.docker.com/). We’re using the official Docker image for Node.js and it’s version 10 image.

- On second line we declare argument `NODE_PORT` which we will pass it from `docker-compose`.

- On third line we log to check argument is successfully read 

- On fourth line we sets a working directory from where the app code will live inside the Docker container.

- On fifth line, we are copying/bundling our code working directory into container working directory on line three.

- On line seven, we run npm install for dependencies in container on line four.

- On Line eight, we setup the port, that Docker will expose when the container is running. In our case it is the port which we define inside `.env` file, read it from `docker-compose` then passed as a argument to the (backend)`DockerFile`.

- And in last, we tell docker to execute our app inside the container by using node to run `npm run dev. It is the command which I registered in __package.json__ in script section.

###### :clipboard: `Note: For development purpose I used __nodemon__ , If you need to deploy at production you should change CMD from __npm run dev__ to __npm start__.`

#### 3. Snippet of frontend(ReactJS)`DockerFile`

You will find this `DockerFile` inside **frontend** directory. 

```bash
# Create image based on the official Node image from dockerhub
FROM node:10

#Argument that is passed from docer-compose.yaml file
ARG FRONT_END_PORT

# Create app directory
WORKDIR /usr/src/app

#Echo the argument to check passed argument loaded here correctly
RUN echo "Argument port is : $FRONT_END_PORT"

# Copy dependency definitions
COPY package.json /usr/src/app

# Install dependecies
RUN npm install

# Get all the code needed to run the app
COPY . /usr/src/app

# Expose the port the app runs in
EXPOSE ${FRONT_END_PORT}

# Serve the app
CMD ["npm", "start"]
```
##### 3.1 Explanation of frontend(ReactJS) `DockerFile`

Frontend `DockerFile` is almost the same as Backend `DockerFile`. The 
only difference is argument name.

Now lets understand the `docker-compose` file

#### 4. Snippet of `docker-compose`

```bash
version: "2"
services:
  frontend:
    build:
      context: frontend
      args:
        FRONT_END_PORT: ${FRONT_END_PORT}
    ports:
      - ${FRONT_END_PORT}:${FRONT_END_PORT}
    volumes:
      - ./frontend:/usr/src/app
    container_name: front-container
    restart: always
  app:
    container_name: app
    restart: always
    build:
      context: .
      args:
        NODE_PORT: ${NODE_PORT}
    ports:
      - ${NODE_PORT}:${NODE_PORT}
    volumes:
      - .:/usr/src/app
    depends_on:
      - mongo
  mongo:
    container_name: mongo
    restart: always
    image: mongo:4.2.0
    volumes:
      - ./data:/data/db
    ports:
      - ${MONGODB_PORT}:${MONGODB_PORT}
```


##### 4.1 Explanation of `docker-compose`

__Version__

The first line defines the version of a file. It sounds confusing :confused:. What is meant by version of file ?? 

:pill: The Compose file is a YAML file defining services, networks, and volumes for a Docker application. So it is only a version of describing compose.yaml file. There are several versions of the Compose file format – 1, 2, 2.x, and 3.x.

__Services__

Our main goal to create a containers, it starts from here. As you can see there are three services(Docker images): 
- First is __frontend__ 
- Second is __app__ which is __backend - NodeJS__. I used a name app here, it's totally on you to name it __backend__.
- Third is __MongoDB__.

##### 4.1.1 Service app (backend - NodeJS)

We make image of app from our `DockeFile`, explanation below.

__Explanation of service app__

- Defining a **nodejs** service as __app__.
- We named our **node server** container service as **app**. Assigning a name to the containers makes it easier to read when there are lot of containers on a machine, it can aslo avoid randomly generated container names. (Although in this case, __container_name__ is also __app__, this is merely personal preference, the name of the service and container do not have to be the same.) 
- Docker container starts automatically if its fails.
- Building the __app__ image using the Dockerfile from the current directory and passing an argument to the
backend `DockerFile`.
- Mapping the host port to the container port.
- Why we used `${}` ?. It is the way to read `environment` variables from `.env` file inside `docker-compose`. But it should be in the same directory of `docker-compose`.   

##### 4.1.2 Service mongo

We add another service called **mongo** but this time instead of building it from `DockerFile` we write all the instruction here directly. We simply pull down the standard __mongo image__ from the [DockerHub](https://hub.docker.com/) registry as we have done it for Node image.

__Explanation of service mongo__

- Defining a **mongodb** service as __mongo__.
- Pulling the mongo 4.2.0 image image again from [DockerHub](https://hub.docker.com/).
- Mount our current db directory to container. 
- For persistent storage, we mount the host directory ( just like I did it in **Node** image inside `DockerFile` to reflect the changes) `/data` ( you need to create a directory in root of your project in order to save changes to locally as well) to the container directory `/data/db`, which was identified as a potential mount point in the `mongo Dockerfile` we saw earlier.
- Mounting volumes gives us persistent storage so when starting a new container, Docker Compose will use the volume of any previous containers and copy it to the new container, ensuring that no data is lost.
- Finally, we link/depends_on the app container to the mongo container so that the mongo service is reachable from the app service.
- In last mapping the host port to the container port.

:key: `If you wish to check your DB changes on your local machine as well. You should have installed MongoDB locally, otherwise you can't access your mongodb service of container from host machine.` 

:white_check_mark: You should check your __mongo__ version is same as used in image. You can see the version of __mongo__ image in `docker-compose `file, I used __image: mongo:4.2.0__. If your mongo db version on your machine is not same then furst you have to updated your  local __mongo__ version in order to works correctly.

#### 5. Command to Build and Run the Docker images/containers

We can now navigate to the project directory, open up a terminal window and run :

```bash
$ sudo docker-compose up
```

It will start make the image and start the two container one is __Node__ and other is __mongo__. If image makes correctly you will see the output like :

```
app      | > docker_node_mongo_starter@1.0.0 dev /usr/src/app
app      | > nodemon server/server.js
app      | 
app      | [nodemon] 1.19.4
app      | [nodemon] to restart at any time, enter `rs`
app      | [nodemon] watching dir(s): *.*
app      | [nodemon] watching extensions: js,mjs,json
app      | [nodemon] starting `node server/server.js`
app      | { PORT: 3000, MONGODB_URI: 'mongodb://mongo:27017/TodoApp' }
app      | Server is up on port 3000
mongo    | 2019-10-17T11:22:06.621+0000 I  NETWORK  [listener] connection accepted from 172.18.0.3:57620 #1 (1 connection now open)
mongo    | 2019-10-17T11:22:06.630+0000 I  NETWORK  [conn1] received client metadata from 172.18.0.3:57620 conn1: { driver: { name: "nodejs", version: "3.1.1" }, os: { type: "Linux", name: "linux", architecture: "x64", version: "4.15.0-65-generic" }, platform: "Node.js v10.16.3, LE, mongodb-core: 3.1.0" }
app      | 2019-10-17 11:22:06 INFO  MongoDB connected on mongodb://mongo:27017/TodoApp
```

#### 6. Verification of Server is running and DB is connected

Now to check an api of todos you hit the api using __curl__. Curl is need to be installed on your machine. Otherwise you should use postman for hitting an api.

To Install curl run the command :

```bash
$  sudo apt-get update
```

then

```bash
$  sudo apt-get install curl
```

After installing curl run the command:

```bash
$  curl http://localhost:3000/api
```

If everything works fine you will get the response 

`{"code":200,"success":true,"message":"Successfully completed","todos":[]}`

Right now there is no todos in DataBase.

To insert some todos in DB hit the post api of todos e.g:

```bash
$   curl -d '{"text":"Testing todo"}' -H "Content-Type: application/json" -X POST http://localhost:3000/api/todos
```

I added the text for todo is "testing todo" you can write any text you want. You can add much todos as you want. To check todo is insert in DB, call the `get` todo api again as we called earlier and this time you will see the added todo in todos array.

`{"code":200,"success":true,"message":"Successfully completed","todos":[{"_id":"5da71f426e17e00020a67539","text":"Testing todo","__v":0}]}`

#### 7. Verification of FrontEnd

Open your favourite browser and go to 

###### :clipboard: `Note: It is the port which I defined in `.env` file you can change this port it's totally on you.`

```
http://localhost:5000/
```


You will see something like this

![image](front.png)

Now Play with the app :sunglasses:	

That's all Folks :tada:

#### Conclusion

We have a build a simple application that persists data in MongoDB. We were able to Dockerize that application and use 
to lunch both the application and MongoDB in a single command. Lastly, we used volumes to ensure the persisted data remains after the MongoDB container is destroyed.
