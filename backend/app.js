const express = require('express');
const { TeamMember } = require('./model');

const app = express();
app.use(express.json());

app.get('/team', async (req, res, next) => {
  const team = await TeamMember.findAll();
  return res.json(team);
});

/**
 * Post route for creating a new member in the db.
 * Will return a 400 error if the request body does not contain valid data for creating a new member.
 */
app.post('/member', async (req, res) => {
  const data = req.body;
  try {
    const newMember = await TeamMember.create(data);
    return res.json(newMember);
  }
  catch (e) {
    return res.status(400).send('[400] Invalid data. Could not create new team member!');
  }
  
});

module.exports = app;
