const optionsSQL = {
    client: 'sqlite3',
    connection: {
      filename:  __dirname + '../DB/mydb.sqlite'
    },
    useNullAsDefault: true
}
 
module.exports = {
optionsSQL
}