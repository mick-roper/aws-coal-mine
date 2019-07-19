#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { SharedStack } from '../lib/common'
import { ChaosdServiceStack } from '../lib/service'

const props: cdk.StackProps = {
  env: {
    region: 'eu-west-1'
  },
  tags: {
    project: 'canary release testing'
  }
}

const app = new cdk.App();
const sharedStack = new SharedStack(app, 'shared-stuff', props)
const chaosdServiceStackv1 = new ChaosdServiceStack(app, 
  'chaosd-service-v1', 
  { 
    ...props, 
    cluster: sharedStack.cluster,
    domain: {
      rootDomainName: 'kotic.io',
      zoneId: 'Z3BHVK8AFSOXLX'
    },
    certificateArn: 'arn:aws:acm:eu-west-1:317464599277:certificate/e935b7fa-60b0-4354-93ee-29978d6baa38'
  }
)

chaosdServiceStackv1.addDependency(sharedStack, 'the root stack')