import { useState, useEffect } from 'react';
import { Tag, Plus, Pencil, Trash2, X } from 'lucide-react';
import { getTagsStorage, setTagsStorage } from '../../data/candidateTagsData';
import type { CandidateTag } from '../../data/candidateTagsData';

export default function CandidateTagsPage() {
  const [tags, setTags] = useState<CandidateTag[]>([]);

  useEffect(() => {
    setTags(getTagsStorage());
  }, []);

  const saveTags = (newTags: CandidateTag[]) => {
    setTags(newTags);
    setTagsStorage(newTags);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveTag = (tagData: { label: string; colorClass: string }) => {
    const newTag: CandidateTag = {
      id: `t-${Date.now()}`,
      label: tagData.label,
      colorClass: tagData.colorClass
    };
    saveTags([...tags, newTag]);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this tag?")) {
      saveTags(tags.filter(t => t.id !== id));
    }
  };

  const handleEdit = (id: string) => {
    const tag = tags.find(t => t.id === id);
    if (!tag) return;
    const newLabel = window.prompt("Edit tag label:", tag.label);
    if (!newLabel) return;
    saveTags(tags.map(t => t.id === id ? { ...t, label: newLabel } : t));
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Tag className="text-gray-800" size={24} />
            <h1 className="text-2xl font-bold text-gray-900">Candidate Tags</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">Manage the tag cloud available to interviewers in the end-of-interview feedback dialog.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gray-900 text-white hover:bg-black px-5 py-2.5 rounded-full text-sm font-bold transition-colors shadow-sm"
        >
          <Plus size={16} /> New Tag
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-800">Active ({tags.length})</h2>
        </div>

        <div className="divide-y divide-gray-50">
          {tags.map(tag => (
            <div key={tag.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${tag.colorClass}`}>
                {tag.label}
              </span>
              
              <div className="flex items-center gap-4 text-gray-400">
                <button 
                  onClick={() => handleEdit(tag.id)}
                  className="hover:text-gray-700 transition-colors"
                  title="Edit tag"
                >
                  <Pencil size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(tag.id)}
                  className="hover:text-red-500 transition-colors"
                  title="Delete tag"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          
          {tags.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-500 font-medium">
              No active tags found. Click "New Tag" to add one.
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <NewTagModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveTag} 
        />
      )}
    </div>
  );
}

function NewTagModal({
  onClose,
  onSave
}: {
  onClose: () => void;
  onSave: (tag: { label: string; colorClass: string; description: string; isActive: boolean }) => void;
}) {
  const [label, setLabel] = useState('');
  const [colorClass, setColorClass] = useState('bg-orange-500 text-white');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  const colors = [
    'bg-orange-500', 'bg-blue-500', 'bg-emerald-500', 'bg-red-500', 
    'bg-purple-500', 'bg-amber-500', 'bg-pink-500', 'bg-teal-500', 
    'bg-indigo-500', 'bg-slate-500'
  ];

  const handleSave = () => {
    if (!label.trim()) return;
    onSave({ label, colorClass, description, isActive });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden p-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">New tag</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">Name</label>
            <input 
              type="text" 
              placeholder="e.g. Strong Communicator" 
              value={label}
              onChange={e => setLabel(e.target.value)}
              className="w-full border border-orange-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1.5">Color</label>
            <div className="flex flex-wrap gap-2">
              {colors.map(c => {
                const isSelected = colorClass.includes(c);
                return (
                  <button 
                    key={c}
                    type="button"
                    onClick={() => setColorClass(`${c} text-white`)}
                    className={`w-8 h-8 rounded-full ${c} ${isSelected ? 'ring-2 ring-offset-2 ring-gray-900' : 'border border-transparent'} transition-all`}
                  />
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1.5">Description (optional)</label>
            <textarea 
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-300 resize-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isActive ? 'bg-orange-500' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${isActive ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
            <span className="text-sm text-gray-700">Active (available to interviewers)</span>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button 
              onClick={onClose}
              className="px-5 py-2 rounded-full text-sm font-bold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={!label.trim()}
              className="px-5 py-2 rounded-full text-sm font-bold bg-gray-900 text-white hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
