import { text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateMailuEnv } from './builder';

export const GET: RequestHandler = async () => {
  return text(generateMailuEnv(options));
};
