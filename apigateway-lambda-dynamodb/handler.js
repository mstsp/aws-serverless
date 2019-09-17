"use strict";
const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();
const uuidv4 = require("uuid/v4");
require('dotenv').config();

const TABLE_NAME = process.env.TABLE_NAME;

module.exports.getPerson = async (event, context, callback) => {
  let id = event.pathParameters.id;

  let params = {
    TableName: TABLE_NAME,
    Key: {
      id: id
    }
  };

  try {
    const data = await db.get(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    console.log(err);
  }
};

module.exports.postPerson = async (event, context, callback) => {
  let item = JSON.parse(event.body);
  item.id = uuidv4();

  let params = {
    TableName: TABLE_NAME,
    Item: item
  };

  try {
    const data = await db.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify("user created")
    };
  } catch (err) {
    console.log(err);
  }
};

module.exports.getPersons = async (event, context, callback) => {

  let params = {
    TableName: TABLE_NAME
  };

  try {
    const data = await db.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    console.log(err);
  }
};
