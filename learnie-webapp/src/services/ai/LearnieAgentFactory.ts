import {LearnieAgent} from './LearnieAgent.ts';
import {OpenAILearnieAgent} from './OpenAILearnieAgent.ts';
import {RemoteLearnieAgent} from './RemoteLearnieAgent.ts';
import {config} from '../../config';

/**
 * Factory for creating AI providers
 */
export class LearnieAgentFactory {
  /**
   * Get an AI provider based on the configuration
   * @returns An instance of the configured AI provider
   */
  static getAgent(providerType = config.ai.provider): LearnieAgent {
    const apiKey = config.ai.apiKey;
    const model = config.ai.model;

    switch (providerType) {
      case 'openai':
        return new OpenAILearnieAgent(apiKey, model);
      case 'remote':
        return new RemoteLearnieAgent();
      default:
        throw new Error(`Unknown provider type: ${providerType}`);
    }
  }
}
