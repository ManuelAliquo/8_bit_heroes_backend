const express = require("express");
const connection = require("../db/connection");

//? INDEX
const index = (req, res) => {
  res.send("INDEX");
};

//? STORE
const store = (req, res) => {
  res.send("STORE");
};

module.exports = { index, store };
