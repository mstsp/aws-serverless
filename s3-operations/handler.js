"use strict";
const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3({
  signatureVersion: "v4"
});
require("dotenv").config();

const TableName = process.env.TABLE_NAME;
const BucketName = process.env.BUCKET_NAME;

module.exports.saveFile = async (event, context, callback) => {
  const key = event.Records[0].s3.object.key;
  var name = event.Records[0].s3.object.key.match(/[\w-]+\.jpg/g);
  const paramsSignedUrl = { Bucket: BucketName, Key: key };
  const url = s3.getSignedUrl("getObject", paramsSignedUrl);

  let item = {
    name: name,
    path: key,
    url: url
  };

  let params = {
    TableName: TableName,
    Item: item
  };

  try {
    await db.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify("image created")
    };
  } catch (err) {
    console.log(err);
  }

  callback(null);
};

module.exports.deleteFile = async (event, context, callback) => {
  const key = event.Records[0].s3.object.key;

  let params = {
    TableName: TableName,
    Key: {
      path: key
    }
  };

  try {
    await db.delete(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify("image deleted")
    };
  } catch (err) {
    console.log(err);
  }

  callback(null);
};

module.exports.getImages = async (event, context, callback) => {

  let params = {
    TableName: TableName
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

