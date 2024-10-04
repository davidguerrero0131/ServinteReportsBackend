const oracledb = require('oracledb');
oracledb.initOracleClient({libDir:'C:\\MisAplicaciones\\instantclient_23_5'});

database = {
    user: "solo_lectura",
    password: "Temporal01",
    connectString: "192.168.10.101:1521/db1"
}


async function Open(sql, binds, autoCommit) {
    let cnn = await oracledb.getConnection(database);
    let result = await cnn.execute(sql, binds, { autoCommit });
    cnn.release();
    return result;
}

exports.Open = Open;