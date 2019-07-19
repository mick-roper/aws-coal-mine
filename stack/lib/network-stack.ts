import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2')
import ecs = require('@aws-cdk/aws-ecs')

export class NetworkStack extends cdk.Stack {
  private _vpc: ec2.IVpc
  public get vpc(): ec2.IVpc {
    return this._vpc
  }

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this._vpc = new ec2.Vpc(this, 'application vpc', {
      cidr: '10.0.0.0/16',
      maxAzs: 3,
      subnetConfiguration: [
        {
          cidrMask: 24, 
          name: 'public', 
          subnetType: ec2.SubnetType.PUBLIC
        },
        {
          cidrMask: 24, 
          name: 'private', 
          subnetType: ec2.SubnetType.PRIVATE
        },
        {
          cidrMask: 24, 
          name: 'isolated', 
          subnetType: ec2.SubnetType.ISOLATED
        },
      ],
      natGatewaySubnets: { 
        subnetName: 'public' 
      },
    })
  }
}
