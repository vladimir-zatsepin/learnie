import {Topic} from '../models';


// localStorage keys
const TOPICS_STORAGE_KEY = 'learnie_topics';
const CURRENT_TOPIC_ID_STORAGE_KEY = 'learnie_current_topic_id';

/**
 * Class responsible for storing and retrieving topics from localStorage
 */
export class TopicStorage {
  /**
   * Load all topics from localStorage
   * @returns Array of topics
   */
  loadTopics(): Topic[] {
    // Try to get topics from localStorage
    const savedTopics = localStorage.getItem(TOPICS_STORAGE_KEY);
    if (savedTopics) {
      try {
        return JSON.parse(savedTopics);
      } catch (error) {
        console.error('Failed to parse topics from localStorage:', error);
        return [];
      }
    }
    return [];
  }

  /**
   * Load current topic from localStorage
   * @returns Current topic or null if not found
   */
  loadCurrentTopic(topics: Topic[]): Topic | null {
    const savedCurrentTopicId = localStorage.getItem(CURRENT_TOPIC_ID_STORAGE_KEY);
    if (savedCurrentTopicId) {
      return topics.find(t => t.id === savedCurrentTopicId) || null;
    }
    return null;
  }

  /**
   * Save topics to localStorage
   * @param topics Array of topics to save
   */
  saveTopics(topics: Topic[]): void {
    localStorage.setItem(TOPICS_STORAGE_KEY, JSON.stringify(topics));
  }

  /**
   * Save current topic ID to localStorage
   * @param topicId ID of the current topic or null
   */
  saveCurrentTopicId(topicId: string | null): void {
    if (topicId) {
      localStorage.setItem(CURRENT_TOPIC_ID_STORAGE_KEY, topicId);
    } else {
      localStorage.removeItem(CURRENT_TOPIC_ID_STORAGE_KEY);
    }
  }
}

// Export a singleton instance
export const topicStorage = new TopicStorage();
