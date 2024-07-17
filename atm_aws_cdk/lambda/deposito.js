
exports.handler = async (event) => {
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Deposito por realizar" })
    }
}

exports.handler = async (event) => {

    // Conectarse a mysql
    const mysql = require('mysql');

    const connection = mysql.createConnection({
        host: 'localhost',   
        user: 'root',
        password: 'root',
        database: 'mydb' //3306
    });

    const transaccion = JSON.parse(event.body.numeroCuenta);
    const objCuenta = connection.query(
        'SELECT * FROM cuenta WHERE numeroCuenta = ?',
        [transaccion.cuenta],
        
    );

    if(objCuenta.monto > transaccion.monto) {

    }



    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Deposito por realizar" })
    }
}