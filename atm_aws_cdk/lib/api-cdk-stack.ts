import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration, LambdaRestApi, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Function, Code, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

export class ATMStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Lambda para depositar dinero
    const lambdaDepositarDinero = new Function(this, 'LambdaDepositarDinero', {
      runtime: Runtime.NODEJS_20_X,
      handler: 'deposito.handler',
      code: Code.fromAsset('lambda'),
    })

    //Lambda para retirar dinero
    const lambdaRetirarDinero = new Function(this, 'LambdaRetirarDinero', {
      runtime: Runtime.NODEJS_20_X,
      handler: 'retiro.handler',
      code: Code.fromAsset('lambda'),
    })

    // Lambda para cambiar la clave de la tarjeta de debito
    const lambdaCambiarClave = new Function(this, 'LambdaCambiarClave', {
      runtime: Runtime.NODEJS_20_X,
      handler: 'cambiarClave.handler',
      code: Code.fromAsset('lambda'),
    })

    // Metodo POST
    // API Gateway para exponer las funciones
    const api = new RestApi(this, 'ApiGateway', {
      restApiName: 'ApiGateway-ATM',
    })

    // Crear los recursos
    // /atm/depositar
    // /atm/retirar
    // /atm/cambiarClave
    const resource = api.root.addResource('atm')
    resource.addResource('depositar').addMethod('POST', new LambdaIntegration(lambdaDepositarDinero))
    resource.addResource('retirar').addMethod('POST', new LambdaIntegration(lambdaRetirarDinero))
    resource.addResource('cambiarClave').addMethod('POST', new LambdaIntegration(lambdaCambiarClave))





    

    

  }
}
