import { useState, useEffect } from 'react';
import { Award, Eye, Users, Plus, Edit2, Trash2, X, Upload } from 'lucide-react';
import {
  seedBadges,
  getStorageData,
  setStorageData
} from '../../data/roomsOfMastery';
import type { Badge } from '../../data/roomsOfMastery';

// Styled Badge Shield SVG based on Level
function BadgeEmblem({ level }: { level: Badge['level'] }) {
  let shieldColor = '#f59e0b'; // Gold
  let flameColor = '#f97316'; // Orange
  
  if (level === 'Bronze') {
    shieldColor = '#ca8a04';
    flameColor = '#ea580c';
  } else if (level === 'Silver') {
    shieldColor = '#94a3b8';
    flameColor = '#0284c7';
  } else if (level === 'Platinum') {
    shieldColor = '#a855f7';
    flameColor = '#db2777';
  } else if (level === 'Elite') {
    shieldColor = '#dc2626';
    flameColor = '#e11d48';
  }

  return (
    <svg width="45" height="45" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm select-none">
      <path
        d="M50 10L15 25V55C15 72.8 30.1 87.3 50 90C69.9 87.3 85 72.8 85 55V25L50 10Z"
        fill={shieldColor}
        fillOpacity="0.1"
        stroke={shieldColor}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      {/* Inner Shield */}
      <path
        d="M50 20L23 31.5V55C23 68.9 34.7 80.2 50 82.2C65.3 80.2 77 68.9 77 55V31.5L50 20Z"
        fill={shieldColor}
        fillOpacity="0.15"
      />
      {/* Flame Icon */}
      <path
        d="M50 35C45.5 35 41.5 38.5 40.5 43C39.5 47.5 41.5 52 45 54.5C45.5 50.5 48.5 47.5 52 46C51.5 50 54 53.5 57.5 55.5C61 57.5 62.5 62 61.5 66C66 62.5 67 56 64 51.5C61 47 54.5 43 54.5 43C54.5 43 54.5 35 50 35Z"
        fill={flameColor}
      />
      <circle cx="50" cy="71" r="5" fill={shieldColor} />
    </svg>
  );
}

export default function RulesBadgesPage() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);

  // Form inputs
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [category, setCategory] = useState('Learner');
  const [level, setLevel] = useState<Badge['level']>('Bronze');
  const [daysRequired, setDaysRequired] = useState(0);

  // Load Badges on mount
  useEffect(() => {
    const data = getStorageData<Badge[]>('badges', seedBadges);
    setBadges(data);
  }, []);

  // Save changes
  const saveBadges = (updated: Badge[]) => {
    setBadges(updated);
    setStorageData('badges', updated);
  };

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingBadge(null);
    setName('');
    setDescription('');
    setResumeText('');
    setCategory('Learner');
    setLevel('Bronze');
    setDaysRequired(0);
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (badge: Badge) => {
    setEditingBadge(badge);
    setName(badge.name);
    setDescription(badge.description);
    setResumeText(badge.resumeText);
    setCategory(badge.category);
    setLevel(badge.level);
    setDaysRequired(badge.daysRequired);
    setIsModalOpen(false); // Trigger state clear first if open
    setTimeout(() => setIsModalOpen(true), 50);
  };

  // Handle Save
  const handleSaveBadge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !resumeText.trim()) {
      alert('Please fill in all details.');
      return;
    }

    let updated: Badge[];

    if (editingBadge) {
      // Edit mode
      updated = badges.map((b) => {
        if (b.id === editingBadge.id) {
          return {
            ...b,
            name,
            description,
            resumeText,
            category,
            level,
            daysRequired,
          };
        }
        return b;
      });
    } else {
      // Create mode
      const newBadge: Badge = {
        id: `badge-${Date.now()}`,
        name,
        description,
        resumeText,
        category,
        level,
        daysRequired,
        isActive: true,
      };
      updated = [...badges, newBadge];
    }

    saveBadges(updated);
    setIsModalOpen(false);
  };

  // Delete Badge
  const handleDeleteBadge = (id: string) => {
    if (confirm('Are you sure you want to delete this badge?')) {
      const updated = badges.filter((b) => b.id !== id);
      saveBadges(updated);
    }
  };

  // Toggle active status
  const handleToggleActive = (id: string) => {
    const updated = badges.map((b) => {
      if (b.id === id) {
        return { ...b, isActive: !b.isActive };
      }
      return b;
    });
    saveBadges(updated);
  };

  // Stats
  const totalBadges = badges.length;
  const activeBadgesCount = badges.filter((b) => b.isActive).length;
  // Let's assume a pre-seeded base of 121 badges awarded, and add 15 per active custom badges
  const totalAwarded = 121 + (badges.length - seedBadges.length) * 8;

  // Group badges by Category. Let's group them or display under Streak group.
  const learnerBadges = badges.filter((b) => b.category === 'Learner');
  const otherBadges = badges.filter((b) => b.category !== 'Learner');

  return (
    <div className="flex flex-col gap-6">
      {/* Title Header Row */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#02759e]">Rules & Badges</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage badge types, upload badge images, and configure point requirements
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-1.5 bg-[#0a3a60] hover:bg-[#082d4b] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer shadow-sm"
        >
          <Plus size={16} />
          Create Badge
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Badges</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{totalBadges}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
            <Award size={20} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Badges</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{activeBadgesCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
            <Eye size={20} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Badges Awarded</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{totalAwarded}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
            <Users size={20} />
          </div>
        </div>
      </div>

      {/* Streaks Badges Group Card List */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <span className="text-lg">🔥</span>
          <h2 className="text-base font-extrabold text-gray-900">Learner Badges (Streaks)</h2>
        </div>

        {learnerBadges.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No learner badges configured.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {learnerBadges.map((badge) => {
              // badge color class
              let tagStyle = 'bg-gray-100 text-gray-600';
              if (badge.level === 'Bronze') tagStyle = 'bg-orange-50 text-orange-700 border border-orange-200';
              else if (badge.level === 'Silver') tagStyle = 'bg-slate-100 text-slate-700 border border-slate-200';
              else if (badge.level === 'Gold') tagStyle = 'bg-yellow-50 text-yellow-700 border border-yellow-200';
              else if (badge.level === 'Platinum') tagStyle = 'bg-purple-50 text-purple-700 border border-purple-200';
              else if (badge.level === 'Elite') tagStyle = 'bg-red-50 text-red-700 border border-red-200';

              return (
                <div
                  key={badge.id}
                  className={`bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between relative hover:border-[#029bcf] transition-all group ${
                    !badge.isActive ? 'opacity-65' : ''
                  }`}
                >
                  <div>
                    {/* Badge Top Header */}
                    <div className="flex justify-between items-start gap-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${tagStyle}`}>
                        {badge.level}
                      </span>

                      {/* Right Toggle Active & Edit/Delete actions */}
                      <div className="flex items-center gap-2">
                        {/* Toggle switch */}
                        <button
                          onClick={() => handleToggleActive(badge.id)}
                          className={`w-9 h-5 rounded-full relative transition-colors cursor-pointer shrink-0 ${
                            badge.isActive ? 'bg-[#029bcf]' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                              badge.isActive ? 'right-0.5 translate-x-0' : 'left-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Badge Content */}
                    <div className="mt-4 flex flex-col">
                      <h3 className="font-extrabold text-sm text-gray-900">
                        {badge.name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 font-medium leading-relaxed min-h-[32px]">
                        {badge.description}
                      </p>
                      <p className="text-xs text-gray-500 font-bold mt-2">
                        {badge.daysRequired} days
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom Emblem Graphic & actions */}
                  <div className="border-t border-gray-100 mt-4 pt-3 flex items-center justify-between">
                    <div className="flex items-center justify-center bg-gray-50/50 p-1.5 rounded-lg border border-gray-100">
                      <BadgeEmblem level={badge.level} />
                    </div>

                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenEdit(badge)}
                        className="p-1.5 border border-gray-200 hover:border-[#029bcf] text-gray-400 hover:text-[#029bcf] rounded-md transition-all"
                        title="Edit Badge"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteBadge(badge.id)}
                        className="p-1.5 border border-gray-200 hover:border-red-500 text-gray-400 hover:text-red-500 rounded-md transition-all"
                        title="Delete Badge"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Render other categories if any */}
      {otherBadges.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <h2 className="text-base font-extrabold text-gray-900">Other Achievements</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {otherBadges.map((badge) => (
              <div
                key={badge.id}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600 uppercase">
                    {badge.level}
                  </span>
                  <h3 className="font-extrabold text-sm text-gray-900 mt-3">{badge.name}</h3>
                  <p className="text-xs text-gray-400 mt-1 font-medium">{badge.description}</p>
                </div>
                <div className="border-t border-gray-100 mt-4 pt-3 flex items-center justify-between">
                  <BadgeEmblem level={badge.level} />
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleOpenEdit(badge)} className="p-1.5 hover:bg-gray-50 border border-gray-100 rounded text-gray-500">
                      <Edit2 size={12} />
                    </button>
                    <button onClick={() => handleDeleteBadge(badge.id)} className="p-1.5 hover:bg-red-50 border border-gray-100 rounded text-red-500">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create / Edit Badge Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-extrabold text-[#02759e]">
                {editingBadge ? 'Edit Badge' : 'Create Badge'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveBadge} className="p-5 flex flex-col gap-4 max-h-[78vh] overflow-y-auto">
              {/* Badge Name */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                  Badge Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Consistency Bronze"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Complete quizzes for 7 consecutive days"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-100 resize-none"
                />
              </div>

              {/* Resume Text */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                  Resume Text
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain details to show on candidate resume..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-100 resize-none text-xs"
                />
                <span className="text-[9px] text-gray-400 font-medium leading-relaxed block mt-1">
                  This text will appear on the candidate's resume to explain what this badge represents.
                </span>
              </div>

              {/* Category & Level */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  >
                    <option value="Learner">Learner</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Master">Master</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                    Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as Badge['level'])}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  >
                    <option value="Bronze">Bronze</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                    <option value="Elite">Elite</option>
                  </select>
                </div>
              </div>

              {/* Days Required */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                  Days Required
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={daysRequired}
                  onChange={(e) => setDaysRequired(parseInt(e.target.value) || 0)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>

              {/* Badge image mock selector */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                  Badge Image
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                  <Upload className="text-gray-400 mb-1" size={16} />
                  <span className="text-xs font-semibold text-gray-600">Browse... No file selected.</span>
                  <span className="text-[9px] text-gray-400 mt-1">Upload a badge image (JPEG, PNG, WebP or SVG). Max size 5MB.</span>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 justify-end border-t border-gray-50 pt-4 mt-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 font-semibold text-xs rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0a3a60] hover:bg-[#082d4b] text-white font-semibold text-xs rounded-lg shadow-sm cursor-pointer"
                >
                  {editingBadge ? 'Save Badge' : 'Create Badge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
