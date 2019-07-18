#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { FargateStack } from '../lib/fargate-stack';

const props: cdk.StackProps = {
  env: {
    region: 'eu-west-1',
    account: '317464599277' // symmetric
  }
} 

const app = new cdk.App();
new FargateStack(app, 'FargateStack', props);
