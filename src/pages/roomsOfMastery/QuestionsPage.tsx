import { useState, useEffect } from 'react';
import { Edit2, HelpCircle, Calendar, Plus, Trash2, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  rooms,
  seedQuestions,
  seedMultiplierDates,
  seedActiveDates,
  getStorageData,
  setStorageData
} from '../../data/roomsOfMastery';
import type { Question, MultiplierDate, Room } from '../../data/roomsOfMastery';

const PRESETS: Record<number, { text: string; options: string[]; correctAnswer: 'A' | 'B' | 'C' | 'D' }[]> = {
  1: [
    { text: "Which function in Excel is used to search for a value in the leftmost column of a table?", options: ["VLOOKUP", "HLOOKUP", "INDEX", "MATCH"], correctAnswer: "A" },
    { text: "What does the abbreviation AI stand for?", options: ["Artificial Intelligence", "Automated Interface", "Active Integration", "Algorithm Index"], correctAnswer: "A" },
    { text: "Which shortcut key is used to paste text?", options: ["Ctrl + V", "Ctrl + C", "Ctrl + P", "Ctrl + X"], correctAnswer: "A" },
    { text: "What is the primary function of a VPN?", options: ["Secure network connection", "Increase internet speed", "Block popup ads", "Store browser history"], correctAnswer: "A" },
    { text: "Which Google Chrome shortcut opens a new incognito window?", options: ["Ctrl + Shift + N", "Ctrl + N", "Ctrl + T", "Ctrl + Shift + T"], correctAnswer: "A" }
  ],
  2: [
    { text: "What is market penetration?", options: ["Selling existing products to existing markets", "Selling new products to new markets", "Selling existing products to new markets", "None of the above"], correctAnswer: "A" },
    { text: "Which term describes the amount of profit made relative to cost?", options: ["Margin", "Revenue", "Equity", "Liability"], correctAnswer: "A" },
    { text: "What is a 'disruptive technology'?", options: ["A technology that displaces an established industry", "A technology that causes server downtime", "A new computer hardware component", "A security vulnerability"], correctAnswer: "A" }
  ],
  3: [
    { text: "What is active listening?", options: ["Fully concentrating, understanding, and responding to a speaker", "Writing down every word someone says", "Nodding continuously without speaking", "Interrupting with solutions quickly"], correctAnswer: "A" },
    { text: "Which tone is most appropriate for a professional project update email?", options: ["Objective and concise", "Informal and casual", "Apologetic and defensive", "Humorous and long-winded"], correctAnswer: "A" }
  ],
  4: [
    { text: "What is compound interest?", options: ["Interest calculated on the initial principal and accumulated interest", "Interest calculated only on the initial principal", "Interest charged on credit cards monthly", "A tax levied on financial investment accounts"], correctAnswer: "A" },
    { text: "Which organization regulates monetary policy in India?", options: ["RBI", "SEBI", "IRDAI", "NITI Aayog"], correctAnswer: "A" }
  ],
  5: [
    { text: "If a doctor gives you 3 pills and tells you to take one every half hour, how long will they last?", options: ["1 hour", "1.5 hours", "2 hours", "30 minutes"], correctAnswer: "A" },
    { text: "A clock shows 3:15. What is the angle between the hour and minute hands?", options: ["7.5 degrees", "0 degrees", "15 degrees", "90 degrees"], correctAnswer: "A" }
  ],
  6: [
    { text: "What does git merge do?", options: ["Integrates changes from one branch into another", "Deletes a local repository branch", "Pushes commits to a remote server", "Compares two files line by line"], correctAnswer: "A" },
    { text: "In Javascript, what is the correct syntax for a comments?", options: ["// comment", "<!-- comment -->", "/* comment */", "Both A and C"], correctAnswer: "D" }
  ]
};

export default function QuestionsPage() {
  const [selectedRoom, setSelectedRoom] = useState<Room>(rooms[0]);
  const [currentDate, setCurrentDate] = useState<string>('2026-08-19'); // Default date matching mockups
  const [model, setModel] = useState<string>('GPT-5 Mini');

  // Persistence State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [multipliers, setMultipliers] = useState<MultiplierDate[]>([]);
  const [activeDates, setActiveDates] = useState<Record<number, string[]>>({});
  
  const [isGenerating, setIsGenerating] = useState(false);

  // Load state on mount
  useEffect(() => {
    const qData = getStorageData<Question[]>('questions', seedQuestions);
    const mData = getStorageData<MultiplierDate[]>('multiplier_dates', seedMultiplierDates);
    const aData = getStorageData<Record<number, string[]>>('active_dates', seedActiveDates);
    
    setQuestions(qData);
    setMultipliers(mData);
    setActiveDates(aData);
  }, []);

  // Update default model when selected room changes
  useEffect(() => {
    setModel(selectedRoom.defaultModel);
  }, [selectedRoom]);

  // Questions for currently selected room & date
  const filteredQuestions = questions.filter(
    (q) => q.roomId === selectedRoom.id && q.date === currentDate
  );

  // Find multiplier for currently selected room & date
  const activeMultiplier = multipliers.find(
    (m) => m.roomId === selectedRoom.id && m.date === currentDate
  );

  // Toggle/Set Multiplier Date
  const handleMarkMultiplier = (type: '2X' | '3X') => {
    let updated = [...multipliers];
    const existingIndex = updated.findIndex(
      (m) => m.roomId === selectedRoom.id && m.date === currentDate
    );

    if (existingIndex > -1) {
      if (updated[existingIndex].type === type) {
        // remove if clicked same multiplier type
        updated.splice(existingIndex, 1);
      } else {
        // change multiplier type
        updated[existingIndex].type = type;
      }
    } else {
      // Check if we already have a 2X or 3X multiplier for this room in this month
      const currentMonth = currentDate.substring(0, 7); // YYYY-MM
      const hasTypeInMonth = updated.some(
        (m) => m.roomId === selectedRoom.id && m.date.startsWith(currentMonth) && m.type === type
      );

      if (hasTypeInMonth) {
        alert(`You can only have one ${type} multiplier date per room per month.`);
        return;
      }

      updated.push({
        roomId: selectedRoom.id,
        date: currentDate,
        type,
      });
    }

    setMultipliers(updated);
    setStorageData('multiplier_dates', updated);
  };

  // Change correct answer for a question
  const handleCorrectAnswerChange = (questionId: string, answer: 'A' | 'B' | 'C' | 'D') => {
    const updated = questions.map((q) => {
      if (q.id === questionId) {
        return { ...q, correctAnswer: answer };
      }
      return q;
    });
    setQuestions(updated);
    setStorageData('questions', updated);
  };

  // Delete a question
  const handleDeleteQuestion = (questionId: string) => {
    const updated = questions.filter((q) => q.id !== questionId);
    setQuestions(updated);
    setStorageData('questions', updated);

    // If no questions are left for this date, remove this date from active dates list
    const remainingForDate = updated.filter(
      (q) => q.roomId === selectedRoom.id && q.date === currentDate
    );
    if (remainingForDate.length === 0) {
      const roomActiveDates = activeDates[selectedRoom.id] || [];
      const updatedDates = roomActiveDates.filter((d) => d !== currentDate);
      const newActiveDates = { ...activeDates, [selectedRoom.id]: updatedDates };
      setActiveDates(newActiveDates);
      setStorageData('active_dates', newActiveDates);
    }
  };

  // Generate mock questions
  const handleGenerateQuestions = () => {
    if (filteredQuestions.length >= 10) {
      alert('Maximum of 10 approved questions reached.');
      return;
    }
    setIsGenerating(true);

    setTimeout(() => {
      const roomPresets = PRESETS[selectedRoom.id] || PRESETS[1];
      // Pick a preset that is not already in the filtered questions
      const existingTexts = filteredQuestions.map(q => q.text);
      const availablePresets = roomPresets.filter(p => !existingTexts.includes(p.text));

      let newQuestionData;
      if (availablePresets.length > 0) {
        newQuestionData = availablePresets[0];
      } else {
        // Fallback random generation
        newQuestionData = {
          text: `Sample generated question about ${selectedRoom.name} topic #${filteredQuestions.length + 1}?`,
          options: ["Option A (Correct)", "Option B", "Option C", "Option D"],
          correctAnswer: "A" as const
        };
      }

      const newQ: Question = {
        id: `gen-${Date.now()}`,
        roomId: selectedRoom.id,
        date: currentDate,
        text: newQuestionData.text,
        options: newQuestionData.options,
        correctAnswer: newQuestionData.correctAnswer,
      };

      const updatedQuestions = [...questions, newQ];
      setQuestions(updatedQuestions);
      setStorageData('questions', updatedQuestions);

      // Add to active dates list since we now have questions
      const roomActiveDates = activeDates[selectedRoom.id] || [];
      if (!roomActiveDates.includes(currentDate)) {
        const newActiveDates = {
          ...activeDates,
          [selectedRoom.id]: [...roomActiveDates, currentDate].sort(),
        };
        setActiveDates(newActiveDates);
        setStorageData('active_dates', newActiveDates);
      }

      setIsGenerating(false);
    }, 600);
  };

  // Simple Month Calendar Generator for August 2026
  const getCalendarDays = () => {
    // Aug 1, 2026 starts on Saturday. (So 6 empty spaces on Sunday-Friday)
    // 31 days in August
    const totalDays = 31;
    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

    // July overlap days
    for (let i = 26; i <= 31; i++) {
      days.push({ dateStr: `2026-07-${i}`, dayNum: i, isCurrentMonth: false });
    }

    // August days
    for (let i = 1; i <= totalDays; i++) {
      const dateStr = `2026-08-${i < 10 ? '0' + i : i}`;
      days.push({ dateStr, dayNum: i, isCurrentMonth: true });
    }

    // September padding days (to fill 42 cells)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ dateStr: `2026-09-0${i}`, dayNum: i, isCurrentMonth: false });
    }

    return days;
  };

  const calendarDays = getCalendarDays();
  const roomActiveDates = activeDates[selectedRoom.id] || [];

  return (
    <div className="flex flex-col gap-6">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#02759e]">Rooms of Mastery</h1>
        <p className="text-sm text-gray-500 mt-1">Manage daily questions for skill development rooms</p>
      </div>

      {/* Main Grid: Left sidebar Rooms list, Right content area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Rooms list (Col span 4) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-[#02759e] font-bold border-b border-gray-100 pb-3">
            <Calendar size={18} />
            <h2 className="text-base">Rooms</h2>
          </div>
          <div className="space-y-3">
            {rooms.map((room) => {
              const isSelected = selectedRoom.id === room.id;
              return (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`group relative p-4 rounded-xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'border-[#029bcf] bg-sky-50/20 shadow-sm'
                      : 'border-gray-100 bg-white hover:border-gray-300'
                  }`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const newName = prompt('Enter new room name:', room.name);
                      if (newName) {
                        alert('Room settings saved successfully.');
                      }
                    }}
                    className="absolute top-4 right-4 text-gray-400 hover:text-[#029bcf] opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Edit room"
                  >
                    <Edit2 size={14} />
                  </button>
                  <h3 className={`font-semibold text-sm transition-colors ${
                    isSelected ? 'text-[#02759e]' : 'text-gray-800'
                  }`}>
                    {room.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Audience: <span className="text-gray-500 font-medium">{room.audience}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                    Goal: <span className="text-gray-500 font-medium">{room.goal}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Room (Col span 8) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Header Row */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="flex items-start gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-[#029bcf] flex items-center justify-center font-bold">
                M
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 leading-tight">
                  {selectedRoom.name}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5 font-medium">
                  {currentDate.split('-').reverse().join('/')}
                </p>
              </div>
            </div>

            {/* Model & Generate */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-[#029bcf]"
              >
                <option value="GPT-5 Mini">GPT-5 Mini</option>
                <option value="GPT-4o">GPT-4o</option>
                <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                <option value="Llama 3.1">Llama 3.1</option>
              </select>

              <button
                onClick={handleGenerateQuestions}
                disabled={isGenerating}
                className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-sm disabled:opacity-50"
              >
                <Plus size={14} />
                {isGenerating ? 'Generating...' : `Generate More (${filteredQuestions.length}/10)`}
              </button>
            </div>
          </div>

          {/* Double Sub-column layout: Calendar on Left, Questions on Right */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Calendar Widget (Col span 5) */}
            <div className="md:col-span-5 bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col gap-4">
              <div className="border-b border-gray-100 pb-2">
                <h3 className="text-sm font-bold text-[#02759e]">Select Date</h3>
              </div>

              {/* Calendar Grid Header */}
              <div className="flex justify-between items-center px-1">
                <button className="text-gray-400 hover:text-gray-600 cursor-not-allowed" disabled>
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-bold text-gray-800">August 2026</span>
                <button className="text-gray-400 hover:text-gray-600 cursor-not-allowed" disabled>
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Day Titles */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                  <span key={d} className="text-[10px] font-semibold text-gray-400 uppercase py-1">
                    {d}
                  </span>
                ))}
              </div>

              {/* Day Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, idx) => {
                  const isActive = roomActiveDates.includes(day.dateStr);
                  const isSelected = currentDate === day.dateStr;
                  const dayMultiplier = multipliers.find(
                    (m) => m.roomId === selectedRoom.id && m.date === day.dateStr
                  );

                  let bgClass = 'bg-white text-gray-700 hover:bg-gray-50';
                  if (!day.isCurrentMonth) {
                    bgClass = 'bg-white text-gray-300';
                  } else if (isSelected) {
                    bgClass = 'bg-[#1e2330] text-white font-bold';
                  } else if (isActive) {
                    bgClass = 'bg-[#e2f7ed] text-[#0f8a5f] font-semibold';
                  }

                  return (
                    <div
                      key={idx}
                      onClick={() => day.isCurrentMonth && setCurrentDate(day.dateStr)}
                      className={`relative flex flex-col items-center justify-center aspect-square rounded-lg text-xs cursor-pointer select-none transition-all ${bgClass}`}
                    >
                      <span>{day.dayNum}</span>
                      {dayMultiplier && (
                        <span className={`absolute bottom-0.5 text-[7px] font-extrabold px-1 rounded-full ${
                          dayMultiplier.type === '3X' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
                        }`}>
                          {dayMultiplier.type}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Multiplier configuration */}
              <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
                <h4 className="text-[11px] font-bold text-[#02759e] uppercase tracking-wider">
                  Set Multiplier Dates
                </h4>
                <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                  Select a date above and mark it as 2X or 3X points (one of each per room per month).
                </p>
                <div className="flex gap-2.5 mt-1.5">
                  <button
                    onClick={() => handleMarkMultiplier('2X')}
                    className={`flex-1 text-center py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                      activeMultiplier?.type === '2X'
                        ? 'bg-amber-500 border-amber-600 text-white shadow-sm'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {activeMultiplier?.type === '2X' ? '2X Point Active' : 'Mark 2X Date'}
                  </button>
                  <button
                    onClick={() => handleMarkMultiplier('3X')}
                    className={`flex-1 text-center py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                      activeMultiplier?.type === '3X'
                        ? 'bg-red-500 border-red-600 text-white shadow-sm'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {activeMultiplier?.type === '3X' ? '3X Point Active' : 'Mark 3X Date'}
                  </button>
                </div>
              </div>
            </div>

            {/* Questions list (Col span 7) */}
            <div className="md:col-span-7 flex flex-col gap-4">
              <div className="flex justify-between items-center bg-white rounded-xl border border-gray-200 px-5 py-3 shadow-sm">
                <span className="text-xs font-bold text-[#02759e] uppercase tracking-wider">
                  Approved Questions
                </span>
                <span className="bg-sky-50 text-[#029bcf] text-xs font-bold px-2 py-0.5 rounded-full">
                  {filteredQuestions.length}/10
                </span>
              </div>

              {filteredQuestions.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm flex flex-col items-center justify-center text-center">
                  <HelpCircle size={40} className="text-gray-300 mb-3" />
                  <p className="text-sm font-semibold text-gray-500">No questions for this date</p>
                  <p className="text-xs text-gray-400 mt-1 max-w-xs">
                    No approved questions exist for this room on this date. Click "Generate More" to add.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                  {filteredQuestions.map((question, index) => (
                    <div
                      key={question.id}
                      className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col gap-4"
                    >
                      {/* Card Header */}
                      <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                        <span className="text-xs font-bold text-gray-500">
                          Question {index + 1}
                        </span>

                        <div className="flex items-center gap-2">
                          {/* Answer Selector Dropdown */}
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-400 font-medium">Answer:</span>
                            <select
                              value={question.correctAnswer}
                              onChange={(e) =>
                                handleCorrectAnswerChange(
                                  question.id,
                                  e.target.value as 'A' | 'B' | 'C' | 'D'
                                )
                              }
                              className="bg-gray-50 border border-gray-200 rounded-md px-1.5 py-0.5 text-xs font-bold text-gray-700 focus:outline-none"
                            >
                              <option value="A">A</option>
                              <option value="B">B</option>
                              <option value="C">C</option>
                              <option value="D">D</option>
                            </select>
                          </div>

                          {/* Save/Approve Indicator */}
                          <button
                            className="p-1 rounded bg-sky-50 text-[#029bcf] border border-sky-100 hover:bg-sky-100"
                            title="Question Approved"
                          >
                            <Check size={13} />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteQuestion(question.id)}
                            className="p-1 rounded text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors"
                            title="Delete question"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Question Text */}
                      <p className="text-sm font-semibold text-gray-800 leading-snug">
                        {question.text}
                      </p>

                      {/* Multiple Choices Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {question.options.map((opt, oIdx) => {
                          const letter = ['A', 'B', 'C', 'D'][oIdx] as 'A' | 'B' | 'C' | 'D';
                          const isCorrect = question.correctAnswer === letter;

                          return (
                            <div
                              key={oIdx}
                              onClick={() => handleCorrectAnswerChange(question.id, letter)}
                              className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                                isCorrect
                                  ? 'border-[#0f8a5f] bg-[#e2f7ed] text-[#0f8a5f] font-semibold'
                                  : 'border-gray-100 bg-gray-50 hover:bg-gray-100 text-gray-600'
                              }`}
                            >
                              <span className="font-bold mr-1">{letter}.</span> {opt}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
