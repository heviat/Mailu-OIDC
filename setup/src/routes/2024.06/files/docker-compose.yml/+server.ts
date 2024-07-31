import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateDockerComposeYml } from './builder';

export const GET: RequestHandler = async () => {
  return json(generateDockerComposeYml(options));
};
