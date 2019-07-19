import cdk = require('@aws-cdk/core')
import ecs = require('@aws-cdk/aws-ecs')
import ecsPatterns = require('@aws-cdk/aws-ecs-patterns')

export interface ChaosdServiceStackProps extends cdk.StackProps {
  cluster: ecs.ICluster,
  image?: string
}

export interface ServiceLoadbalancer {
  dnsName: string,
  hostedZoneId: string
}

export class ChaosdServiceStack extends cdk.Stack {
  _loadBalancer: ServiceLoadbalancer

  public get loadBalancer(): ServiceLoadbalancer {
    return this._loadBalancer
  }

  constructor(scope: cdk.Construct, name: string, props: ChaosdServiceStackProps) {
    super(scope, name, props)

    const service = new ecsPatterns.LoadBalancedFargateService(this, 'chaosd-control-plane', {
      cluster: props.cluster,
      image: ecs.ContainerImage.fromRegistry(props.image || 'chaosd/control-plane'),
      cpu: 256,
      memoryLimitMiB: 256,
    })

    this._loadBalancer = {
      dnsName: service.loadBalancer.loadBalancerDnsName,
      hostedZoneId: service.loadBalancer.loadBalancerCanonicalHostedZoneId
    }
  }
}