const AWS = require('aws-sdk');
const axios = require('axios');

exports.handler = async (event) => {
  const webhookUrl = 'URL_DEL_WEBHOOK_DE_ZAPIER';

  // 1. Input Validation
  try {
    const { accountId, oldPassword, newPassword } = JSON.parse(event.body);

    if (!accountId || !oldPassword || !newPassword) {
      throw new Error('Missing required fields: accountId, oldPassword or newPassword');
    }

    // Additional validation for password strength can be added here
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error.message }),
    };
  }

  // 2. Authenticate User (Connect to Cognito or User Pool)
  const cognitoServiceProvider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-11-13' });
  try {
    await cognitoServiceProvider.changeUserPassword({
      AccountId: accountId,
      Password: oldPassword,
      ProposedPassword: newPassword,
    }).promise();
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Invalid credentials or password change failed' }),
    };
  }

  // 3. Construct Success Response
  // Notificar a Zapier
  await axios.post(webhookUrl, {
    action: 'cambiarClave',
    accountId: accountId,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Password changed successfully' }),
  };
};
