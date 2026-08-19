export interface CandidateTag {
  id: string;
  label: string;
  colorClass: string;
}

export const initialCandidateTags: CandidateTag[] = [
  { id: 't1', label: 'Adaptable', colorClass: 'bg-purple-500 text-white' },
  { id: 't2', label: 'Analytical', colorClass: 'bg-blue-500 text-white' },
  { id: 't3', label: 'Confident', colorClass: 'bg-emerald-500 text-white' },
  { id: 't4', label: 'Curious', colorClass: 'bg-indigo-500 text-white' },
  { id: 't5', label: 'Future-Fit', colorClass: 'bg-pink-500 text-white' },
  { id: 't6', label: 'Inconsistent', colorClass: 'bg-orange-500 text-white' },
  { id: 't7', label: 'Needs-Clarity', colorClass: 'bg-orange-400 text-white' },
  { id: 't8', label: 'Needs-Confidence', colorClass: 'bg-orange-500 text-white' },
];

export function getTagsStorage(): CandidateTag[] {
  const v = localStorage.getItem('zigme_candidate_tags');
  return v ? JSON.parse(v) : initialCandidateTags;
}

export function setTagsStorage(val: CandidateTag[]) {
  localStorage.setItem('zigme_candidate_tags', JSON.stringify(val));
}
