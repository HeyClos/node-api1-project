const express = require('express');

const usersModel = require('./data/db'); // <<<<< require data access

const server = express();

// middleware
// teach express how to read JSON fro the request body
server.use(express.json()); // <<<<<<<<<<<<<<<<<<<<<<<<<< we need this for POST and PUT

server.get('/', (req, res) => {
  // order matters, the first argument is the request
  res.send('hello node 22');
});

// When the client makes a GET request to /api/users:

// If there's an error in retrieving the users from the database:
// x cancel the request.
// x respond with HTTP status code 500.
// x return the following JSON object: { error: "The users information could not be retrieved." }.

server.get('/users', (req, res) => {
  // get a list of users from the database
  const userData = req.body;

  usersModel
  .find()
  .then(users => {
    if (!userData) {
        res.status(500).json({ message: "The users information could not be retrieved." });
  } else {
      res.send(users)
  }
  })
  .catch(error => {
    res.status(500).json({ error: "The user information could not be retrieved." });
    });
})

// When the client makes a GET request to /api/users/:id:

// If the user with the specified id is not found:

// x return HTTP status code 404 (Not Found).
// x return the following JSON object: { message: "The user with the specified ID does not exist." }.

// --- If there's an error in retrieving the user from the database: ---
// x cancel the request.
// x respond with HTTP status code 500.
// x return the following JSON object: { error: "The user information could not be retrieved." }.

server.get('/users/:id', (req, res) => {
    const id = req.params.id;

    usersModel
      .findById(id)
      .then(user => {
        if (!user) {
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        } else {
            res.send(user)
            }
        })
        .catch(error => {
            res.status(500).json({ error: "The user information could not be retrieved." });
        });
});

// When the client makes a POST request to /api/users:

// --- If the request body is missing the name or bio property: ---
// x cancel the request.
// x respond with HTTP status code 400 (Bad Request).
// x return the following JSON response: { errorMessage: "Please provide name and bio for the user." }.

// --- If the information about the user is valid: ---
// x save the new user the the database.
// x return HTTP status code 201 (Created).
// x return the newly created user document.

// --- If there's an error while saving the user: ---
// x cancel the request.
// x respond with HTTP status code 500 (Server Error).
// xreturn the following JSON object: { error: "There was an error while saving the user to the database" }.

server.post('/users', (req, res) => {
  // axios.post(url, data);
  // get the user data from the request
  const userData = req.body;

  // validate the data sent by he client
  // NEVER TRUST THE CLIENT!!!!!
  if (!userData.name || !userData.bio) {
    res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    // add the user to the database
    usersModel
      .add(userData)
      .then(user => {
        // send the user back to the client
        res.status(201).json(user); //.json() will set the right headers and convert to JSON
      })
      .catch(error => {
        res.status(500).json({ error: "There was an error while saving the user to the database" });
      });
  }
});

// When the client makes a DELETE request to /api/users/:id:

// If the user with the specified id is not found:

// return HTTP status code 404 (Not Found).
// return the following JSON object: { message: "The user with the specified ID does not exist." }.
// If there's an error in removing the user from the database:

// x cancel the request.
// x respond with HTTP status code 500.
// x return the following JSON object: { error: "The user could not be removed" }.

server.delete('/hubs/:id', (req, res) => {
  // axios.delete('/users/2')
  const id = req.params.id; // params is an object with all the url parameters
  const userData = req.body;
  
  if (!userData) {
    res.status(404).json({ message: "The user with the specified ID does not exist." })
    } else {
    hubsModel
        .findById(id)
        .remove(id)
        .catch(error => {
            res.status(500).json({ error: "The user could not be removed" })
        })
    }
});

// When the client makes a PUT request to /api/users/:id:

// --- If the user with the specified id is not found: ---
// return HTTP status code 404 (Not Found).
// return the following JSON object: { message: "The user with the specified ID does not exist." }.

// --- If the request body is missing the name or bio property: ---
// cancel the request.
// respond with HTTP status code 400 (Bad Request).
// return the following JSON response: { errorMessage: "Please provide name and bio for the user." }.

// --- If there's an error when updating the user: ---
// cancel the request.
// respond with HTTP status code 500.
// return the following JSON object: { error: "The user information could not be modified." }.

// --- If the user is found and the new information is valid: ---
// update the user document in the database using the new information sent in the request body.
// return HTTP status code 200 (OK).
// return the newly updated user document.

server.put('/hubs/:id', (req, res) => {
  const id = req.params.id;
  const changes = req.body;
  
  if (!id) {
    res.status(404).json({ message: "The user with the specified ID does not exist." })
    } else if (!changes.name || !changes.bio) { 
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    } else {
  hubsModel
    .update(id, changes)
    .then(hub => {
      // send the hub back to the client
      res.status(200).json(hub); //.json() will set the right headers and convert to JSON
    })
    .catch(error => {
      res.status(500).json({ error: "The user information could not be modified." });
    });
}});

const port = 8000;
server.listen(port, () => console.log('\nserver running\n'));

// npm i express
// npm run server
// visit localhost:8000

// typos are the bane of developers