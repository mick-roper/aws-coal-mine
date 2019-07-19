import cdk = require('@aws-cdk/core')
import route53 = require('@aws-cdk/aws-route53')

export interface DnsStackProps extends cdk.StackProps {
  rootDomainName: string,
  zoneId: string,
  target: {
    dnsName: string,
    weight: number
  }
}

export class DnsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, name: string, props: DnsStackProps) {
    super(scope, name, props)

    const zone = route53.HostedZone.fromHostedZoneAttributes(this, "zone", {
      hostedZoneId: props.zoneId,
      zoneName: props.rootDomainName
    })

    const set = new route53.RecordSet(this, "domain-name", {
      recordName: `control.${props.rootDomainName}`,
      recordType: route53.RecordType.CNAME,
      target: route53.RecordTarget.fromValues(props.target.dnsName),
      zone
    })

    new route53.CnameRecord(this, "cname", {
      domainName: `controlplane.${props.rootDomainName}`,
      zone,
    })
  }
}
