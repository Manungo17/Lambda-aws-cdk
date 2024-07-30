const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();

exports.handler = async (event) => {
  const webhookUrl = 'URL_DEL_WEBHOOK_DE_ZAPIER';
  
  const transaccion = JSON.parse(event.body);
  
  const db = new sqlite3.Database('/path/to/your/database.db');

  try {
    const transactionDB = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM cuenta WHERE numeroCuenta = ?', [transaccion.numeroCuenta], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });

    const monto = transaccion.monto;

    if (transactionDB.monto >= monto) {
      const saldo = transactionDB.monto - monto;

      // Actualizar el monto de la cuenta en la base de datos
      await new Promise((resolve, reject) => {
        db.run('UPDATE cuenta SET monto = monto - ? WHERE numeroCuenta = ?', [monto, transaccion.numeroCuenta], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      // Notificar a Zapier
      await axios.post(webhookUrl, {
        action: 'retiro',
        cuenta: transaccion.numeroCuenta,
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
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message })
    };
  } finally {
    db.close();
  }
};
