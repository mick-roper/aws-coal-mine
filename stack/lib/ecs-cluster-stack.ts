import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2')
import ecs = require('@aws-cdk/aws-ecs')

export interface EcsClusterStackProps extends cdk.StackProps {
  vpc: ec2.IVpc
}

export class EcsClusterStack extends cdk.Stack {
  private _cluster: ecs.Cluster
  public get cluster(): ecs.Cluster {
    return this._cluster
  }

  constructor(scope: cdk.Construct, id: string, props: EcsClusterStackProps) {
    super(scope, id, props);

    this._cluster = new ecs.Cluster(this, 'fargate', { vpc: props.vpc })
  }
}