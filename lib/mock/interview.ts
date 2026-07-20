export type QuestionCategory =
  | 'technical'
  | 'behavioral'
  | 'system-design'
  | 'coding';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface InterviewQuestion {
  id: string;
  category: QuestionCategory;
  difficulty: Difficulty;
  title: string;
  prompt: string;
  hint: string;
  modelAnswer: string;
  feedback: {
    strengths: string[];
    improvements: string[];
    score: number;
  };
}

export const interviewQuestions: InterviewQuestion[] = [
  {
    id: 'q1',
    category: 'technical',
    difficulty: 'medium',
    title: 'Explain the React reconciliation algorithm',
    prompt:
      'Walk me through how React decides what to update in the DOM after a state change. Where does the virtual DOM fit in?',
    hint: 'Mention keys, diffing heuristics, and fiber.',
    modelAnswer:
      'React compares the previous and next element trees using a O(n) heuristic diffing algorithm. It checks type and key; if both match, it recurses into children, otherwise unmounts and remounts. Fiber lets it split this work into units and pause for higher-priority updates.',
    feedback: {
      strengths: ['Clear structure', 'Mentioned keys and fiber'],
      improvements: ['Add a concrete example', 'Mention time-slicing'],
      score: 82,
    },
  },
  {
    id: 'q2',
    category: 'behavioral',
    difficulty: 'easy',
    title: 'Tell me about a time you disagreed with a teammate',
    prompt:
      'Describe a specific disagreement, how you approached it, and the outcome. Use the STAR framework.',
    hint: 'Focus on your actions, not their faults.',
    modelAnswer:
      'Situation: two teammates wanted different state libraries. Task: I owned the decision. Action: I wrote a 1-page comparison, ran a 30-min spike, and proposed Zustand for size and DX. Result: shipped 2 weeks early, zero regrets.',
    feedback: {
      strengths: ['Used STAR clearly', 'Quantified outcome'],
      improvements: ['Acknowledge the other view first'],
      score: 88,
    },
  },
  {
    id: 'q3',
    category: 'system-design',
    difficulty: 'hard',
    title: 'Design a real-time collaborative editor',
    prompt:
      'Design a Google Docs-like editor for 50 concurrent users per doc. Cover sync strategy, conflict resolution, and persistence.',
    hint: 'CRDT vs OT, presence, offline.',
    modelAnswer:
      'Use Yjs (CRDT) for conflict-free merges over WebRTC/WebSocket. Presence via a separate low-latency channel. Persist op-log to Postgres + S3 snapshots every 100 ops. Backpressure with a server-side sequencer.',
    feedback: {
      strengths: ['Picked CRDT with rationale', 'Covered persistence'],
      improvements: ['Discuss auth & permissions', 'Add a back-of-envelope capacity estimate'],
      score: 74,
    },
  },
  {
    id: 'q4',
    category: 'coding',
    difficulty: 'medium',
    title: 'LRU Cache',
    prompt:
      'Implement an LRU cache with get(key) and put(key, value) both running in O(1). Walk through your design before coding.',
    hint: 'Hash map + doubly linked list.',
    modelAnswer:
      'Combine a Map for O(1) lookups with a doubly linked list to track recency. On access, move the node to head. On put, if over capacity, evict the tail.',
    feedback: {
      strengths: ['Correct data structure choice', 'Analyzed complexity'],
      improvements: ['Handle edge cases (capacity 0)', 'Discuss thread-safety'],
      score: 90,
    },
  },
  {
    id: 'q5',
    category: 'technical',
    difficulty: 'hard',
    title: 'How does the browser render a page?',
    prompt:
      'From receiving HTML to pixels on screen, walk through the critical rendering path and where you would optimize.',
    hint: 'DOM, CSSOM, layout, paint, composite.',
    modelAnswer:
      'Parse HTML→DOM and CSS→CSSOM, combine into render tree, run layout, paint, composite layers. Optimize with content-visibility, will-change, reducing layout thrash, and deferring non-critical CSS.',
    feedback: {
      strengths: ['Complete pipeline', 'Concrete optimizations'],
      improvements: ['Mention the main-thread bottleneck'],
      score: 86,
    },
  },
  {
    id: 'q6',
    category: 'behavioral',
    difficulty: 'medium',
    title: 'Describe a project that failed',
    prompt:
      'Tell me about a project that did not meet expectations. What did you own, and what did you learn?',
    hint: 'Ownership over blame.',
    modelAnswer:
      'Owned a feature flag system that shipped late. I under-scoped the audit step. I learned to add a discovery spike and now budget 20% for unknowns.',
    feedback: {
      strengths: ['Took ownership', 'Specific lesson'],
      improvements: ['Tie lesson to a later success'],
      score: 80,
    },
  },
];

export const interviewCategoryMeta: Record<
  QuestionCategory,
  { label: string; icon: string; accent: string; description: string }
> = {
  technical: {
    label: 'Technical',
    icon: 'Cpu',
    accent: 'primary',
    description: 'Deep dives on frameworks, browsers, and architecture.',
  },
  behavioral: {
    label: 'Behavioral',
    icon: 'Users',
    accent: 'secondary',
    description: 'STAR-format stories for leadership and collaboration.',
  },
  'system-design': {
    label: 'System Design',
    icon: 'Network',
    accent: 'accent',
    description: 'Scalable systems, trade-offs, and capacity planning.',
  },
  coding: {
    label: 'Coding',
    icon: 'Code2',
    accent: 'primary',
    description: 'Data structures, algorithms, and complexity analysis.',
  },
};
