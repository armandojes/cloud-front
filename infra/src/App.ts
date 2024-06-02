#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import Pipeline from './Pipeline';

const app = new cdk.App();

new Pipeline(app, 'ArmanFrontPipeline', {
  environmentName: 'develop'
});

new Pipeline(app, 'ArmanFrontPipeline', {
  environmentName: 'quality'
});

new Pipeline(app, 'ArmanFrontPipeline', {
  environmentName: 'master'
});