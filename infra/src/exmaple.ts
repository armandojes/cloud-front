import * as cdk from 'aws-cdk-lib';

import { Construct } from 'constructs';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Distribution, OriginAccessIdentity, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Environment } from './contracts';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { sslCertificateArn } from './constants';
import { getUrlForEnvironment } from './helpers';

interface StackProps extends cdk.StackProps {
  environment: Environment
}

class Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const websiteBucketName = `hosting-setup-front-${props.environment}`;
    const cloudfrontDistributionName = `cloudfront-distribution-setup-front-${props.environment}`;
    const deploymentBucketName = `deployment-setup-front-${props.environment}`;
    const originAccessIdentityName = `origin-access-identity-setup-front-${props.environment}`;
    const sslCertificateId = `ssl-certificate-setup-front-${props.environment}`;
    const url = getUrlForEnvironment(props.environment)


    const hostingBucket = new Bucket(this, websiteBucketName, {
      bucketName: websiteBucketName,
      autoDeleteObjects: true,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const originAccess = new OriginAccessIdentity(this, originAccessIdentityName, {});
    hostingBucket.grantRead(originAccess);

    const certificate = Certificate.fromCertificateArn(this, sslCertificateId, sslCertificateArn)

    const distribution = new Distribution(this, cloudfrontDistributionName, {
      certificate: certificate,
      defaultBehavior: {
        origin: new S3Origin(hostingBucket, {
          originAccessIdentity: originAccess,
        }),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
      domainNames: [url],
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    });

    new BucketDeployment(this, deploymentBucketName, {
      sources: [Source.asset('./dist')],
      destinationBucket: hostingBucket,
      distribution,
    });
  }
}

export default Stack;