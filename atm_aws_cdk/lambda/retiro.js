const axios = require('axios');

exports.handler = async (event) => {
  const webhookUrl = 'https://hooks.zapier.com/hooks/catch/19611852/2u1ew1y/';

  const transaccion = JSON.parse(event.body);

  const transactionDB = {
    numeroCuenta: "123456",
    monto: 100.00,
    estado: "completed",
    timestamp: new Date().toISOString()
  };
  
  // Conectarse a mysql
  const mysql = require('mysql');

  const connection = mysql.createConnection({
    host: 'localhost',   
    user: 'root',
    password: 'root',
    database: 'mydb' //3306
  });
  const monto = transaccion.monto;

  if (transactionDB.monto < monto) {
    const saldo = transactionDB.monto - monto;

    // Notificar a Zapier
    await axios.post(webhookUrl, {
      action: 'retiro',
      cuenta: transactionDB.numeroCuenta,
      monto: monto,
      saldo: saldo
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Retiro exitoso", saldo })
    };
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No tiene suficiente saldo" })
    };
  }
};
