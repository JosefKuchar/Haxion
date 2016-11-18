var dbm = global.dbm || require("db-migrate");
var type = dbm.dataType;

exports.up = function (db) {
  return db.createTable("users", {
    id: { type: "int", primaryKey: true },
    name: "string",
    password: "string" 
  });
};

exports.down = function (db) {
  return db.dropTable("users");
};