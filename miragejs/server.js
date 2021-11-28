import { Server } from 'miragejs';
import factories from './factories';
import routes from './routes';
import models from './models';
import seeds from './seeds';

const config = (environment) => {
  return {
    environment,
    factories,
    models,
    routes,
    seeds,
  };
};

export function makeServer({ environment = 'development' } = {}) {
  return new Server(config(environment));
}
