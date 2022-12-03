const express = require('express');
const app = express();
const { MongoClient, ObjectId } = require('mongodb'); // hago require del driver de MongoDB
require('dotenv').config();

const uri = 'mongodb://localhost:27017';

const getPersons = async () => {
  let persons;
  const dbClient = new MongoClient(uri);
  try {
    const database = dbClient.db('db_persons');
    const coll = database.collection('persons');
    const cursor = coll.find({});
    persons = await cursor.toArray();

  } catch (error) {
    console.error(error);
  } finally {
    await dbClient.close();
  }
  return persons;
};

const getPersonsByCountry = async (country) => {
  let persons;
  const filter = {
    'country': country
  };
  const dbClient = new MongoClient(uri);
  try {
    const coll = dbClient.db('db_persons').collection('persons');
    const cursor = coll.find(filter);
    persons = await cursor.toArray();
  } catch (error) {
    console.error(error);
  } finally {
    await dbClient.close();
  }
  return persons;
};

const getPersonById = async (id) => {
  let person;
  const filter = {
    '_id': ObjectId(id)
  };
  const client = new MongoClient(uri);
  try {
    const coll = client.db('db_persons').collection('persons');
    const cursor = coll.find(filter);
    person = await cursor.toArray()

  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
  return person;
};


app.get('/persons', (req, res) => {
  getPersons()
    .then((data) => {
      res.json(data)
    });
});
app.get('/persons/:id', (req, res) => {
  getPersonById(req.params.id)
    .then((data) => {
      res.json(data);
    })
});

app.get('/persons/bycountry/:country', (req, res) => {
  getPersonsByCountry(req.params.country)
    .then((data) => {
      res.json(data);
    })
});


app.listen(process.env.PORT, () => {
  console.log(`listen in port ${process.env.PORT}`);
})