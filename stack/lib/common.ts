import cdk = require('@aws-cdk/core')
import ec2 = require('@aws-cdk/aws-ec2')
import ecs = require('@aws-cdk/aws-ecs')

export class SharedStack extends cdk.Stack {
  public readonly cluster: ecs.ICluster

  constructor(scope: cdk.Construct, name: string, props: cdk.StackProps) {
    super(scope, name, props)

    const vpc = new ec2.Vpc(this, 'the VPC', {
      maxAzs: 3,
      cidr: '10.0.0.0/16',
      subnetConfiguration: [
        { 
          cidrMask: 20,
          subnetType: ec2.SubnetType.PUBLIC,
          name: 'public-1'
        },
        { 
          cidrMask: 20,
          subnetType: ec2.SubnetType.PRIVATE,
          name: 'private-1'
        },
      ],
      natGateways: 1,
      natGatewaySubnets: {
        onePerAz: true,
        subnetType: ec2.SubnetType.PUBLIC
      },
    })

    this.cluster = new ecs.Cluster(this, 'ballpit', { vpc })
  }
}