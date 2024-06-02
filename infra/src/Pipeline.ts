import * as cdk from 'aws-cdk-lib';
import * as pipelines from 'aws-cdk-lib/pipelines';
import Stage from './Stage'


import { Construct } from 'constructs';
import addSuffix from './helpers/addSuffix';
import EnvironmentName from './contracts/EnvironmentName';

interface PipelineProps extends cdk.StackProps {
  environmentName: EnvironmentName;
}

class Pipeline extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PipelineProps) {
    super(scope, id, props);

    const pipeline = new pipelines.CodePipeline(this, 'ArmandFrontPipeline', {
      pipelineName: addSuffix('ArmandFrontPipeline', props.environmentName),
      synth: new pipelines.CodeBuildStep('CompileInfraAndCode', {
        input: pipelines.CodePipelineSource.gitHub('armandojes/cloud-front', props.environmentName),
        commands: [
          'npm ci',
          'npm run build',
          'cd infra',
          'npm ci',
          'npm run build',
          'npx cdk synth',
        ],
        primaryOutputDirectory: 'infra/cdk.out',
      })
    })


    pipeline.addStage(new Stage(this, 'ArmanDevFrontStage', {
      environmentName: props.environmentName
    }))
  }
}

export default Pipeline;