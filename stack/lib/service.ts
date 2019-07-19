import cdk = require('@aws-cdk/core')
import ecs = require('@aws-cdk/aws-ecs')
import ecsPatterns = require('@aws-cdk/aws-ecs-patterns')
import certificatemanager = require('@aws-cdk/aws-certificatemanager')
import route53 = require('@aws-cdk/aws-route53')

const getRandomPort = () => {
  const min = 20000, max = 65500

  return Math.floor((Math.random() * (max - min)) + min)
}

export interface ChaosdServiceStackProps extends cdk.StackProps {
  cluster: ecs.ICluster,
  domain: {
    rootDomainName: string,
    zoneId: string
  }
}

export class ChaosdServiceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, name: string, props: ChaosdServiceStackProps) {
    super(scope, name, props)

    const port = getRandomPort()

    const r53Zone = route53
      .HostedZone
      .fromHostedZoneAttributes(this, 
        'r53-zone', 
        { 
          hostedZoneId: props.domain.zoneId, 
          zoneName: props.domain.rootDomainName 
        })

    const domainName = `controlplane.${props.domain.rootDomainName}`

    new ecsPatterns.LoadBalancedFargateService(this, 'chaosd-control-plane', {
      cluster: props.cluster,
      image: ecs.ContainerImage.fromRegistry('chaosd/control-plane'),
      cpu: 256,
      memoryLimitMiB: 512,
      serviceName: 'chaosd-control-plane',
      publicLoadBalancer: true,
      desiredCount: 1,
      domainName,
      domainZone: r53Zone,
      containerPort: port,
      environment: {
        PORT: `${port}`
      }
    })
  }
}