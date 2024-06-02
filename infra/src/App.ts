#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import Stack from './Stack';

const app = new cdk.App();

new Stack(app, 'ArmanDevFrontStack', {
  environmentName: 'develop'
});

new Stack(app, 'ArmanQaFrontStack', {
  environmentName: 'quality'
});