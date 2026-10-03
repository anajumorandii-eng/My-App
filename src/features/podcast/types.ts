import type { PodcastEpisode } from '../../types';
import type { PodcastSettings } from '../../lib/podcastConfig';
export interface PersonalPodcast extends PodcastEpisode {
  settings: PodcastSettings;
  createdAt: string;
  sourceLabels: string[];
  focus: string;
}
