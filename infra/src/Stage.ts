import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs'
import Stack from './Stack'
import EnvironmentName from './contracts/EnvironmentName';

interface StageProps extends cdk.StageProps {
  environmentName: EnvironmentName;
}


class Stage extends cdk.Stage {
  constructor(scope: Construct, id: string, props: StageProps) {
    super(scope, id, props);

    new Stack(this, `armandoFrontStack-${props.environmentName}`, {
      environmentName: props.environmentName
    });
  }
}

export default Stage;
