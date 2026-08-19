export interface CareerQuestion {
  id: string;
  phase: 1 | 2;
  group: string;
  question: string;
  optionA: string;
  optionB: string;
  active: boolean;
}

export const careerQuestions: CareerQuestion[] = [
  {
    id: 'cq-1',
    phase: 1,
    group: 'Work Rhythm',
    question: 'When does your brain actually switch on?',
    optionA: 'Sharpest with a sunrise coffee.',
    optionB: 'Best ideas after midnight.',
    active: true,
  },
  {
    id: 'cq-2',
    phase: 1,
    group: 'Work Rhythm',
    question: 'What kind of timeline do you actually thrive on?',
    optionA: 'A 48-hour sprint.',
    optionB: 'A six-month roadmap.',
    active: true,
  },
  {
    id: 'cq-3',
    phase: 1,
    group: 'Decision Style',
    question: 'How do you make a tough call?',
    optionA: 'Gut instinct, fast.',
    optionB: 'Data first, always.',
    active: true,
  },
  {
    id: 'cq-4',
    phase: 1,
    group: 'Social Energy',
    question: 'Where do you recharge after a long day?',
    optionA: 'A packed room of people.',
    optionB: 'Quiet, alone time.',
    active: false,
  },
  {
    id: 'cq-5',
    phase: 2,
    group: 'Business & Strategy',
    question: 'Where do you want to sit when big decisions happen?',
    optionA: 'I want to be in the room where the big decision gets made.',
    optionB: 'I want to build the model that informs the big decision.',
    active: true,
  },
  {
    id: 'cq-6',
    phase: 2,
    group: 'Business & Strategy',
    question: 'Outward-facing or inward-facing work?',
    optionA: 'Client-facing work and pitching energise me.',
    optionB: 'Internal strategy and operational execution energise me.',
    active: true,
  },
  {
    id: 'cq-7',
    phase: 2,
    group: 'Engineering & Product',
    question: 'What part of building something excites you most?',
    optionA: 'Shipping the first working version fast.',
    optionB: 'Designing the system so it scales for years.',
    active: true,
  },
  {
    id: 'cq-8',
    phase: 2,
    group: 'Design & Creative',
    question: 'What pulls you into a project?',
    optionA: 'Solving a gnarly usability problem.',
    optionB: 'Crafting something visually beautiful.',
    active: false,
  },
];

export function getGroups(phase: 1 | 2) {
  return Array.from(new Set(careerQuestions.filter((q) => q.phase === phase).map((q) => q.group)));
}
