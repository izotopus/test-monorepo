import type { TechItem } from '../schemas/content';

export interface TechGridProps {
  techStack: TechItem[];
  variant?: 'compact' | 'full';
}