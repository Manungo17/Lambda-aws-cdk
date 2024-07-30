const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();

exports.handler = async (event) => {
  const webhookUrl = 'URL_DEL_WEBHOOK_DE_ZAPIER';
  
  const transaccion = JSON.parse(event.body);
  
  const db = new sqlite3.Database('/path/to/your/database.db');

  try {
    const objCuenta = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM cuenta WHERE numeroCuenta = ?', [transaccion.cuenta], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });

    if (objCuenta.monto > transaccion.monto) {
      // Actualizar el monto de la cuenta en la base de datos
      await new Promise((resolve, reject) => {
        db.run('UPDATE cuenta SET monto = monto + ? WHERE numeroCuenta = ?', [transaccion.monto, transaccion.cuenta], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      // Notificar a Zapier
      await axios.post(webhookUrl, {
        action: 'deposito',
        cuenta: transaccion.cuenta,
        monto: transaccion.monto,
      });

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Depósito realizado" })
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Monto insuficiente" })
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
