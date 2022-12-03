const express = require('express');
const app = express();
const { MongoClient, ObjectId } = require('mongodb'); // hago require del driver de MongoDB
require('dotenv').config();

app.use(express.json()); // habilita que el req.body lea los datos en json

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

//const addPerson = async (person) => {
const addPerson = async (name, email, country, birthday, company, marital_status) => {
  const client = new MongoClient(uri);

  // let person = {
  //   name: name,
  //   email: email,
  //   country: country,
  //   birthday: birthday,
  //   company: company,
  //   marital_status: marital_status
  // }

  try {
    await client.db('db_persons').collection('persons').insertOne(
      {
        name: name,
        email: email,
        country: country,
        birthday: birthday,
        company: company,
        marital_status: marital_status
      }
    );
  } catch (error) {
    console.error(error);
  } finally {
    client.close();
  }
};

const delPerson = async (id) => {
  const filter = {
    "_id": ObjectId(id)
  }
  const client = new MongoClient(uri);
  try {
    await client.db("db_persons").collection("persons").deleteOne(filter);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
};


// end points
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

app.post('/persons', (req, res) => {
  addPerson(req.body.name, req.body.email, req.body.country, req.body.birthday, req.body.company, req.body.marital_status)
    .then(console.log('document is created'));
  res.send("ok");
});

app.delete('/persons/:id', (req, res) => {
  delPerson(req.params.id)
    .then(() => {
      console.log("document is deleted");
      res.send("ok");
    });
  // .catch(
  //   res.send("no ok")
  // );
})

app.listen(process.env.PORT, () => {
  console.log(`listen in port ${process.env.PORT}`);
})