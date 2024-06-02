import EnvironmentName from "../contracts/EnvironmentName";

const getConfigFileName = (env: EnvironmentName): string => {
  if (env === 'develop') return 'armando-front-dev'
  if (env === 'master') return 'armando-front-prod'
  if (env === 'quality') return 'armando-front-qa'

  throw new Error(`Invalid environment name: ${env}`)
};

export default getConfigFileName;