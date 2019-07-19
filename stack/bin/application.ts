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

const rootDomainName = 'kotic.io'
const controlPlaneDomainName = `control.${rootDomainName}`

const app = new cdk.App();
const sharedStack = new SharedStack(app, 'shared-stuff', props)
const chaosdServiceStackv0_1_34 = new ChaosdServiceStack(app, 
  'chaosd-service-v1', 
  { 
    ...props, 
    cluster: sharedStack.cluster, 
    image: 'chaosd/control-plane:0.1.34'
  })

chaosdServiceStackv0_1_34.addDependency(sharedStack, 'the root stack')