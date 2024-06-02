import EnvironmentName from "../contracts/EnvironmentName";

const addSuffix = (name: string, environmentName: EnvironmentName) => {
  if (environmentName === 'develop') return `${name}-dev`;
  if (environmentName === 'quality') return `${name}-qa`;
  if (environmentName === 'master') return `${name}-prod`;

  throw new Error(`Invalid environment name: ${environmentName}`)
}

export default addSuffix;