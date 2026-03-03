import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Screen, Note, Folder, SharedNote, Reminder } from './types';

// --- Mock Data ---
const MOCK_NOTES: Note[] = [
  { id: '1', title: 'Project Launch', content: 'Finalize the marketing assets and coordinate with the dev team for the V1 release.', date: 'OCT 24, 2023', category: 'Work', isPinned: true },
  { id: '2', title: 'Grocery List', content: 'Oat milk, avocados, whole grain bread, dark chocolate, and coffee beans.', date: 'OCT 23, 2023', category: 'Personal' },
  { id: '3', title: 'Book Ideas', content: 'A sci-fi novel about a world where digital memories can be traded as currency.', date: 'OCT 22, 2023', category: 'Ideas' },
  { id: '4', title: 'Meeting Notes', content: 'Discussed Q4 goals and established KPIs for the social media campaigns.', date: 'OCT 20, 2023', category: 'Work' },
  { id: '5', title: 'Workout Plan', content: 'Monday: Chest & Triceps. Wednesday: Back & Biceps. Friday: Legs & Shoulders.', date: 'OCT 18, 2023', category: 'Personal' },
  { id: '6', title: 'Vacation Prep', content: 'Check passport validity, book airport shuttle, and exchange currency.', date: 'OCT 15, 2023', category: 'Ideas' },
];

const MOCK_FOLDERS: Folder[] = [
  { id: '1', name: 'All Notes', count: 124, icon: 'all_inbox', color: 'slate' },
  { id: '2', name: 'Work', count: 42, icon: 'work', color: 'blue' },
  { id: '3', name: 'Personal', count: 28, icon: 'person', color: 'purple' },
  { id: '4', name: 'Study', count: 15, icon: 'school', color: 'emerald' },
  { id: '5', name: 'Travel', count: 9, icon: 'flight', color: 'amber' },
  { id: '6', name: 'Collaborative', count: 12, icon: 'group', color: 'rose' },
  { id: '7', name: 'Archive', count: 205, icon: 'archive', color: 'slate' },
];

const MOCK_SHARED: SharedNote[] = [
  { id: 's1', title: 'Marketing Strategy 2024', content: 'Reviewing the Q1 roadmap for social media expansion and influencer partnerships.', date: 'OCT 24, 2023', category: 'Work', updatedAt: '2 hours ago', collaborators: ['JD', 'MK'], permission: 'View Only' },
  { id: 's2', title: 'Product Specs - v2.0', content: 'Defining the core requirements for the upcoming dark mode overhaul and shared workspace features.', date: 'OCT 23, 2023', category: 'Work', updatedAt: 'Yesterday', collaborators: ['MK'], permission: 'Can Edit' },
  { id: 's3', title: 'Event Planning: Retreat', content: 'Logistics for the mountain retreat including cabin rentals, food catering, and workshop materials.', date: 'OCT 12, 2023', category: 'Personal', updatedAt: 'Oct 12, 2023', collaborators: [], permission: 'View Only' },
];

const MOCK_REMINDERS: Reminder[] = [
  { id: 'r1', title: 'Review Marketing Strategy', time: 'Today, 2:00 PM', linkedNote: 'Project Launch Notes', isCompleted: false, isUpcoming: true },
  { id: 'r2', title: 'Buy anniversary gift', time: 'Tomorrow, 10:00 AM', linkedNote: 'Personal Checklist', isCompleted: false, isUpcoming: true },
  { id: 'r3', title: 'Q4 Budget Approval', time: 'Oct 30, 09:00 AM', linkedNote: 'Finance Meeting Notes', isCompleted: false, isUpcoming: true },
  { id: 'r4', title: 'Draft blog post update', time: 'Yesterday', linkedNote: 'Content Calendar', isCompleted: true, isUpcoming: false },
  { id: 'r5', title: 'Book dental appointment', time: 'Oct 22', linkedNote: 'Health Log', isCompleted: true, isUpcoming: false },
];

// --- Components ---

const Navigation = ({ current, setScreen }: { current: Screen, setScreen: (s: Screen) => void }) => (
  <nav className="flex items-center justify-around border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/95 backdrop-blur-md px-4 pb-8 pt-3 fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto z-50">
    <button onClick={() => setScreen('dashboard')} className={`flex flex-col items-center gap-1 ${current === 'dashboard' ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}>
      <span className={`material-symbols-outlined ${current === 'dashboard' ? 'active-icon' : ''}`}>sticky_note_2</span>
      <p className="text-[10px] font-medium">Notes</p>
    </button>
    <button onClick={() => setScreen('reminders')} className={`flex flex-col items-center gap-1 ${current === 'reminders' ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}>
      <span className={`material-symbols-outlined ${current === 'reminders' ? 'active-icon' : ''}`}>notifications</span>
      <p className="text-[10px] font-medium">Alerts</p>
    </button>
    <button onClick={() => setScreen('folders')} className={`flex flex-col items-center gap-1 ${current === 'folders' ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}>
      <span className={`material-symbols-outlined ${current === 'folders' ? 'active-icon' : ''}`}>folder</span>
      <p className="text-[10px] font-medium">Folders</p>
    </button>
    <button onClick={() => setScreen('shared')} className={`flex flex-col items-center gap-1 ${current === 'shared' ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}>
      <span className={`material-symbols-outlined ${current === 'shared' ? 'active-icon' : ''}`}>group</span>
      <p className="text-[10px] font-medium">Shared</p>
    </button>
    <button onClick={() => setScreen('settings')} className={`flex flex-col items-center gap-1 ${current === 'settings' ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}>
      <span className={`material-symbols-outlined ${current === 'settings' ? 'active-icon' : ''}`}>settings</span>
      <p className="text-[10px] font-medium">Settings</p>
    </button>
  </nav>
);

// --- Screens ---

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-between h-screen py-12 px-6 bg-background-light dark:bg-background-dark overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>
      <div className="relative z-10 flex-grow flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-gradient-to-br from-primary to-blue-400 rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/30 mb-8">
          <span className="material-symbols-outlined text-white text-6xl active-icon">edit_note</span>
        </div>
        <div className="text-center">
          <h1 className="text-slate-900 dark:text-slate-100 text-4xl font-bold tracking-tight mb-2">SwiftNotes</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base font-medium">Personal & Professional Note-taking</p>
        </div>
      </div>
      <div className="relative z-10 w-full mt-auto pt-20 flex flex-col gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">Preparing your workspace</span>
          <div className="flex gap-1">
            <span className="w-1 h-1 bg-primary rounded-full animate-pulse"></span>
            <span className="w-1 h-1 bg-primary rounded-full animate-pulse delay-75"></span>
            <span className="w-1 h-1 bg-primary rounded-full animate-pulse delay-150"></span>
          </div>
        </div>
        <div className="w-full max-w-[200px] h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
            className="h-full bg-primary rounded-full"
          />
        </div>
        <p className="text-slate-400 dark:text-slate-600 text-xs font-semibold tracking-widest uppercase mt-4">Secured & Synced</p>
      </div>
    </div>
  );
};

const LoginScreen = ({ onLogin }: { onLogin: () => void }) => (
  <div className="flex flex-col justify-center items-center p-6 h-screen bg-background-light dark:bg-background-dark">
    <div className="w-full max-w-[400px] flex flex-col items-center">
      <div className="mb-8 flex items-center justify-center w-16 h-16 rounded-2xl bg-primary shadow-lg shadow-primary/20">
        <span className="material-symbols-outlined text-white text-4xl">edit_note</span>
      </div>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-slate-900 dark:text-slate-100">Welcome Back</h1>
        <p className="text-slate-500 dark:text-slate-400">Capture your thoughts, anywhere.</p>
      </div>
      <form className="w-full space-y-5" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
          <input className="w-full h-14 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary outline-none text-slate-900 dark:text-slate-100" placeholder="name@company.com" type="email" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Password</label>
          <div className="relative">
            <input className="w-full h-14 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary outline-none text-slate-900 dark:text-slate-100" placeholder="••••••••" type="password" />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" type="button">
              <span className="material-symbols-outlined">visibility</span>
            </button>
          </div>
        </div>
        <div className="flex justify-end pt-1">
          <a className="text-sm font-medium text-primary hover:underline" href="#">Forgot Password?</a>
        </div>
        <button className="w-full h-14 bg-primary text-white font-semibold rounded-xl shadow-lg shadow-primary/25 hover:brightness-110 active:scale-[0.98] transition-all" type="submit">Sign In</button>
      </form>
      <div className="w-full flex items-center my-10 gap-4">
        <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800"></div>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">or continue with</span>
        <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800"></div>
      </div>
      <div className="grid grid-cols-2 gap-4 w-full">
        <button className="flex items-center justify-center h-14 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
          <img alt="Google" className="w-5 h-5 mr-3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPOLVl6yktevyaxfczHmATJwwbYuL90qTiM6fFKjTYkDynmDoGzC440r-AKDD-j1g2pIt18ZW5TnCU5rOUFGaHlOy8PstC1twjUI0xbRuqk4umU5bc6-DoTcy6nTJVtRt6ElNOgQBdYm3_X3iFfN8kwPU_ZiUknV5G_Kh0efQUC2bViOUlztIgjDIZQtLskK8DuN_7WSCr8wMu8jpXG-h4MS04AZtL1DmY_ldONVkFUaQTlyZtLa-P8PN4TshKjWlJWKQhu1SWi2A" referrerPolicy="no-referrer" />
          <span className="font-medium text-slate-700 dark:text-slate-300">Google</span>
        </button>
        <button className="flex items-center justify-center h-14 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
          <span className="material-symbols-outlined mr-3 text-slate-900 dark:text-slate-100">ios</span>
          <span className="font-medium text-slate-700 dark:text-slate-300">Apple</span>
        </button>
      </div>
      <p className="mt-10 text-slate-500 dark:text-slate-400 text-sm">Don't have an account? <a className="text-primary font-semibold hover:underline" href="#">Create Account</a></p>
    </div>
  </div>
);

const DashboardScreen = ({ setScreen, notes, onEditNote, onCreateNew }: { setScreen: (s: Screen) => void, notes: Note[], onEditNote: (id: string) => void, onCreateNew: () => void }) => (
  <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
    <header className="flex items-center justify-between p-4 pb-2">
      <div className="flex size-10 items-center justify-center rounded-full bg-slate-200/50 dark:bg-slate-800/50">
        <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">menu</span>
      </div>
      <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">My Notes</h2>
      <div className="flex size-10 items-center justify-center rounded-full bg-slate-200/50 dark:bg-slate-800/50 overflow-hidden cursor-pointer" onClick={() => setScreen('settings')}>
        <img alt="Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOZ8rhhq-eQ75bt6MpXvlBUcQ7vmoX_B8MAuxd5bqKkSwmCjUCgtZNO_MBIwDrLgHANDs2pdZT-M20TcrwuNuLLRJTWAfKEEUFLQbrNISybbL4xGOS8LS-Nwe64BOF_R5ORqbItOqjIJ1jQtn4MrljbbOODajUO6nj_Ehk41xc7etq937Y4YUsnyhKleiArE1Qse4yRG39Qg24tW5gRnjc0H1d2ufcGeJcAK-fQp0-csOpwN1JXkKqVJQ1L01_guWIk_JcJz7-buU" referrerPolicy="no-referrer" />
      </div>
    </header>
    <div className="px-4 py-3">
      <div className="flex w-full items-center rounded-xl h-12 bg-slate-200/50 dark:bg-slate-800/50 overflow-hidden px-4 cursor-pointer" onClick={() => setScreen('search')}>
        <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 mr-3">search</span>
        <span className="text-slate-500 dark:text-slate-400">Search your notes</span>
      </div>
    </div>
    <div className="pb-3 overflow-x-auto no-scrollbar">
      <div className="flex border-b border-slate-200 dark:border-slate-800 px-4 gap-6">
        <button className="flex flex-col items-center justify-center border-b-2 border-primary text-primary pb-3 pt-2"><p className="text-sm font-semibold">All</p></button>
        <button className="flex flex-col items-center justify-center border-b-2 border-transparent text-slate-500 dark:text-slate-400 pb-3 pt-2"><p className="text-sm font-semibold">Personal</p></button>
        <button className="flex flex-col items-center justify-center border-b-2 border-transparent text-slate-500 dark:text-slate-400 pb-3 pt-2"><p className="text-sm font-semibold">Work</p></button>
        <button className="flex flex-col items-center justify-center border-b-2 border-transparent text-slate-500 dark:text-slate-400 pb-3 pt-2"><p className="text-sm font-semibold">Ideas</p></button>
      </div>
    </div>
    <main className="flex-1 overflow-y-auto px-4 pt-4 pb-24">
      <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-slate-100">Recent Notes</h3>
      <div className="grid grid-cols-2 gap-4">
        {notes.map(note => (
          <div key={note.id} onClick={() => onEditNote(note.id)} className={`flex flex-col gap-3 p-4 rounded-xl border shadow-sm cursor-pointer active:scale-95 transition-transform ${
            note.category === 'Work' ? 'bg-blue-100/80 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800/50' :
            note.category === 'Personal' ? 'bg-purple-100/80 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800/50' :
            'bg-emerald-100/80 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800/50'
          }`}>
            <div className="flex justify-between items-start">
              <h4 className={`font-bold ${
                note.category === 'Work' ? 'text-blue-900 dark:text-blue-100' :
                note.category === 'Personal' ? 'text-purple-900 dark:text-purple-100' :
                'text-emerald-900 dark:text-emerald-100'
              }`}>{note.title}</h4>
              {note.isPinned && <span className="material-symbols-outlined text-sm opacity-50">push_pin</span>}
            </div>
            <p className="text-sm opacity-80 line-clamp-3">{note.content}</p>
            <p className="text-[10px] font-medium opacity-60 uppercase tracking-wider">{note.date}</p>
          </div>
        ))}
      </div>
    </main>
    <div className="absolute bottom-24 right-6">
      <button onClick={onCreateNew} className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 active:scale-95 transition-transform">
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </div>
    <Navigation current="dashboard" setScreen={setScreen} />
  </div>
);

const FoldersScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => (
  <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
    <header className="flex items-center justify-between p-4 pb-2">
      <div className="flex size-10 items-center justify-center rounded-full bg-slate-200/50 dark:bg-slate-800/50">
        <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">menu</span>
      </div>
      <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Folders</h2>
      <button className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        <span className="material-symbols-outlined">create_new_folder</span>
      </button>
    </header>
    <div className="px-4 py-3">
      <div className="flex w-full items-center rounded-xl h-12 bg-slate-200/50 dark:bg-slate-800/50 overflow-hidden px-4">
        <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 mr-3">search</span>
        <input className="bg-transparent border-none focus:ring-0 w-full" placeholder="Search folders" />
      </div>
    </div>
    <main className="flex-1 overflow-y-auto px-4 pt-2 pb-24">
      <div className="space-y-3">
        {MOCK_FOLDERS.map(folder => (
          <div key={folder.id} className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/60 shadow-sm active:scale-[0.98] transition-transform cursor-pointer">
            <div className="flex items-center gap-4">
              <div className={`flex size-12 items-center justify-center rounded-xl ${
                folder.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                folder.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                folder.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                folder.color === 'amber' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                folder.color === 'rose' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' :
                'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}>
                <span className="material-symbols-outlined active-icon">{folder.icon}</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100">{folder.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{folder.count} notes</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-slate-400">chevron_right</span>
          </div>
        ))}
      </div>
    </main>
    <div className="absolute bottom-24 right-6">
      <button className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 active:scale-95 transition-transform">
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </div>
    <Navigation current="folders" setScreen={setScreen} />
  </div>
);

const SharedScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => (
  <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
    <header className="flex items-center justify-between p-4 pb-2">
      <div className="flex size-10 items-center justify-center rounded-full bg-slate-200/50 dark:bg-slate-800/50">
        <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">arrow_back_ios_new</span>
      </div>
      <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Shared Notes</h2>
      <div className="flex size-10 items-center justify-center rounded-full bg-slate-200/50 dark:bg-slate-800/50">
        <span className="material-symbols-outlined text-slate-700 dark:text-slate-300 text-xl">more_horiz</span>
      </div>
    </header>
    <div className="px-4 py-3">
      <div className="flex w-full items-center rounded-xl h-12 bg-slate-200/50 dark:bg-slate-800/50 overflow-hidden px-4">
        <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 mr-3">search</span>
        <input className="bg-transparent border-none focus:ring-0 w-full" placeholder="Search shared notes" />
      </div>
    </div>
    <div className="px-4 pb-4">
      <div className="flex p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl">
        <button className="flex-1 py-2 text-sm font-semibold rounded-lg bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white transition-all">Shared with me</button>
        <button className="flex-1 py-2 text-sm font-semibold rounded-lg text-slate-500 dark:text-slate-400 transition-all">Shared by me</button>
      </div>
    </div>
    <main className="flex-1 overflow-y-auto px-4 pb-24">
      <div className="flex flex-col gap-4">
        {MOCK_SHARED.map(note => (
          <div key={note.id} className="flex flex-col gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-0.5">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-lg">{note.title}</h4>
                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Updated {note.updatedAt}</p>
              </div>
              <span className="material-symbols-outlined text-primary text-xl active-icon">star</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{note.content}</p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex -space-x-2">
                <img alt="Collaborator" className="size-7 rounded-full border-2 border-white dark:border-slate-900 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOZ8rhhq-eQ75bt6MpXvlBUcQ7vmoX_B8MAuxd5bqKkSwmCjUCgtZNO_MBIwDrLgHANDs2pdZT-M20TcrwuNuLLRJTWAfKEEUFLQbrNISybbL4xGOS8LS-Nwe64BOF_R5ORqbItOqjIJ1jQtn4MrljbbOODajUO6nj_Ehk41xc7etq937Y4YUsnyhKleiArE1Qse4yRG39Qg24tW5gRnjc0H1d2ufcGeJcAK-fQp0-csOpwN1JXkKqVJQ1L01_guWIk_JcJz7-buU" referrerPolicy="no-referrer" />
                <div className="size-7 rounded-full border-2 border-white dark:border-slate-900 bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white uppercase">JD</div>
                <div className="size-7 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">+2</div>
              </div>
              <div className={`flex items-center gap-1 ${note.permission === 'Can Edit' ? 'text-emerald-500' : 'text-slate-400'}`}>
                <span className="material-symbols-outlined text-sm">{note.permission === 'Can Edit' ? 'edit' : 'visibility'}</span>
                <span className="text-[11px] font-medium">{note.permission}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
    <div className="absolute bottom-24 right-6">
      <button className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 active:scale-95 transition-transform">
        <span className="material-symbols-outlined text-3xl">person_add</span>
      </button>
    </div>
    <Navigation current="shared" setScreen={setScreen} />
  </div>
);

const SettingsScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => (
  <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
    <header className="flex items-center justify-between p-4">
      <div className="flex size-10 items-center justify-center rounded-full bg-slate-200/50 dark:bg-slate-800/50 cursor-pointer" onClick={() => setScreen('dashboard')}>
        <span className="material-symbols-outlined text-slate-700 dark:text-slate-300 text-2xl">arrow_back</span>
      </div>
      <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Settings</h2>
      <div className="size-10"></div>
    </header>
    <main className="flex-1 overflow-y-auto px-4 pb-24">
      <div className="mt-4 mb-8 flex flex-col items-center">
        <div className="relative">
          <div className="size-24 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl">
            <img alt="Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOZ8rhhq-eQ75bt6MpXvlBUcQ7vmoX_B8MAuxd5bqKkSwmCjUCgtZNO_MBIwDrLgHANDs2pdZT-M20TcrwuNuLLRJTWAfKEEUFLQbrNISybbL4xGOS8LS-Nwe64BOF_R5ORqbItOqjIJ1jQtn4MrljbbOODajUO6nj_Ehk41xc7etq937Y4YUsnyhKleiArE1Qse4yRG39Qg24tW5gRnjc0H1d2ufcGeJcAK-fQp0-csOpwN1JXkKqVJQ1L01_guWIk_JcJz7-buU" referrerPolicy="no-referrer" />
          </div>
          <button className="absolute bottom-0 right-0 size-8 rounded-full bg-primary text-white flex items-center justify-center border-2 border-background-light dark:border-background-dark">
            <span className="material-symbols-outlined text-sm">edit</span>
          </button>
        </div>
        <h3 className="mt-3 text-lg font-bold">Alex Johnson</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">alex.johnson@example.com</p>
      </div>
      <div className="space-y-6">
        <div>
          <h4 className="px-2 mb-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Account & Preference</h4>
          <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <span className="font-medium">Personal Information</span>
              </div>
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </button>
            <div className="w-full flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <span className="material-symbols-outlined">dark_mode</span>
                </div>
                <span className="font-medium">Dark Mode</span>
              </div>
              <div className="relative inline-flex items-center cursor-pointer">
                <div className="w-11 h-6 bg-primary rounded-full"></div>
                <div className="absolute left-[21px] top-[2px] bg-white w-5 h-5 rounded-full transition-transform"></div>
              </div>
            </div>
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <span className="material-symbols-outlined">notifications</span>
                </div>
                <span className="font-medium">Notifications</span>
              </div>
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </button>
          </div>
        </div>
        <div>
          <h4 className="px-2 mb-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Security & Storage</h4>
          <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <span className="material-symbols-outlined">fingerprint</span>
                </div>
                <div className="text-left">
                  <span className="font-medium block">FaceID & Passcode</span>
                  <span className="text-[10px] text-slate-500">Enabled</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <span className="material-symbols-outlined">cloud_sync</span>
                </div>
                <div className="text-left">
                  <span className="font-medium block">Cloud Sync Status</span>
                  <span className="text-[10px] text-emerald-500 font-semibold uppercase tracking-tight">Synced 2m ago</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </button>
          </div>
        </div>
        <button onClick={() => setScreen('trash')} className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
              <span className="material-symbols-outlined">delete</span>
            </div>
            <span className="font-medium">Recently Deleted</span>
          </div>
          <span className="material-symbols-outlined text-slate-400">chevron_right</span>
        </button>
        <button onClick={() => setScreen('login')} className="w-full py-4 text-rose-500 font-semibold text-center border border-rose-200 dark:border-rose-900/30 bg-rose-50/50 dark:bg-rose-900/10 rounded-2xl mt-4">Sign Out</button>
        <p className="text-center text-[10px] text-slate-400 dark:text-slate-600 pb-4">Version 2.4.0 (Build 108)</p>
      </div>
    </main>
    <Navigation current="settings" setScreen={setScreen} />
  </div>
);

const RemindersScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => (
  <div className="flex flex-col h-screen bg-background-dark">
    <header className="flex items-center justify-between p-4 pb-2 sticky top-0 bg-background-dark/80 backdrop-blur-lg z-10">
      <div className="flex size-10 items-center justify-center rounded-full bg-slate-800/50 cursor-pointer" onClick={() => setScreen('dashboard')}>
        <span className="material-symbols-outlined text-slate-300">arrow_back_ios_new</span>
      </div>
      <h2 className="text-xl font-bold tracking-tight text-slate-100">Reminders</h2>
      <div className="flex size-10 items-center justify-center rounded-full bg-slate-800/50">
        <span className="material-symbols-outlined text-slate-300">more_horiz</span>
      </div>
    </header>
    <div className="px-4 py-3">
      <div className="flex w-full items-center rounded-xl h-11 bg-slate-800/50 overflow-hidden px-4">
        <span className="material-symbols-outlined text-slate-400 text-xl mr-3">search</span>
        <input className="bg-transparent border-none focus:ring-0 w-full text-white" placeholder="Search reminders" />
      </div>
    </div>
    <main className="flex-1 overflow-y-auto px-4 pb-24">
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Upcoming</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-bold">3 ACTIVE</span>
        </div>
        <div className="space-y-3">
          {MOCK_REMINDERS.filter(r => r.isUpcoming).map(reminder => (
            <div key={reminder.id} className="group flex flex-col gap-3 p-4 rounded-2xl bg-[#161618] border border-slate-800 active:bg-slate-800/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <span className="material-symbols-outlined text-primary active-icon">radio_button_unchecked</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-slate-100 leading-snug">{reminder.title}</h4>
                    <span className={`text-xs font-medium ${reminder.time.includes('Today') || reminder.time.includes('Tomorrow') ? 'text-primary' : 'text-slate-500'}`}>{reminder.time}</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1 line-clamp-1">Linked to: <span className="text-primary/80">{reminder.linkedNote}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Past</h3>
          <button className="text-[10px] font-bold text-slate-500 uppercase">Clear All</button>
        </div>
        <div className="space-y-3 opacity-60">
          {MOCK_REMINDERS.filter(r => !r.isUpcoming).map(reminder => (
            <div key={reminder.id} className="group flex flex-col gap-3 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <span className="material-symbols-outlined text-slate-500 active-icon">check_circle</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-slate-400 leading-snug line-through">{reminder.title}</h4>
                    <span className="text-xs font-medium text-slate-600">{reminder.time}</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-1">Linked to: {reminder.linkedNote}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
    <div className="absolute bottom-24 right-6">
      <button className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 active:scale-95 transition-transform">
        <span className="material-symbols-outlined text-3xl">notification_add</span>
      </button>
    </div>
    <Navigation current="reminders" setScreen={setScreen} />
  </div>
);

const SearchScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => (
  <div className="flex flex-col h-screen bg-background-dark">
    <header className="pt-4 px-4 pb-2">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-stretch rounded-xl h-11 bg-slate-800/80 overflow-hidden ring-1 ring-slate-700/50">
          <div className="flex items-center justify-center pl-3 text-slate-400">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input autoFocus className="form-input flex w-full border-none bg-transparent focus:ring-0 placeholder:text-slate-500 px-3 text-base font-normal text-white" placeholder="Search notes, folders, or tags" defaultValue="Project" />
          <button className="flex items-center justify-center pr-3 text-slate-400">
            <span className="material-symbols-outlined text-[20px]">cancel</span>
          </button>
        </div>
        <button onClick={() => setScreen('dashboard')} className="text-primary font-medium text-base">Cancel</button>
      </div>
    </header>
    <main className="flex-1 overflow-y-auto no-scrollbar">
      <section className="px-4 py-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Suggested Tags</h3>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
            <span className="material-symbols-outlined text-sm">tag</span>#work
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium">
            <span className="material-symbols-outlined text-sm">tag</span>#design
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
            <span className="material-symbols-outlined text-sm">tag</span>#finance
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium">
            <span className="material-symbols-outlined text-sm">tag</span>#meeting
          </span>
        </div>
      </section>
      <section className="px-4 py-2">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Folders</h3>
        <div className="space-y-1">
          <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer">
            <div className="size-10 flex items-center justify-center rounded-lg bg-blue-500/20 text-blue-500"><span className="material-symbols-outlined">folder</span></div>
            <div className="flex-1 border-b border-slate-800/50 pb-1">
              <p className="font-medium text-slate-100"><span className="text-primary font-bold">Project</span> Launch 2024</p>
              <p className="text-xs text-slate-500">12 notes</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer">
            <div className="size-10 flex items-center justify-center rounded-lg bg-amber-500/20 text-amber-500"><span className="material-symbols-outlined">folder</span></div>
            <div className="flex-1 border-b border-slate-800/50 pb-1">
              <p className="font-medium text-slate-100">Side <span className="text-primary font-bold">Project</span>s</p>
              <p className="text-xs text-slate-500">4 notes</p>
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Matching Notes</h3>
          <span className="text-[11px] text-slate-600">3 results</span>
        </div>
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 active:bg-slate-800 transition-colors">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-bold text-slate-100"><span className="text-primary">Project</span> Launch Strategy</h4>
              <span className="text-[10px] text-slate-500 uppercase">2h ago</span>
            </div>
            <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">Finalize the <span className="text-slate-200 font-medium">marketing assets</span> and coordinate with the dev team for the V1 release next Monday.</p>
          </div>
        </div>
      </section>
    </main>
  </div>
);

const CreateNoteScreen = ({ setScreen, onSave, initialNote }: { setScreen: (s: Screen) => void, onSave: (note: Partial<Note>) => void, initialNote?: Note }) => {
  const [title, setTitle] = useState(initialNote?.title || '');
  const [content, setContent] = useState(initialNote?.content || '');
  const [category, setCategory] = useState<'Personal' | 'Work' | 'Ideas'>(initialNote?.category || 'Personal');

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
      <header className="flex items-center justify-between px-4 pt-12 pb-4 bg-background-light dark:bg-background-dark border-b border-slate-200 dark:border-slate-800">
        <button onClick={() => setScreen('dashboard')} className="flex items-center justify-center p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">arrow_back_ios</span>
        </button>
        <h1 className="text-lg font-bold tracking-tight">{initialNote ? 'Edit Note' : 'Create New Note'}</h1>
        <button onClick={() => onSave({ title, content, category })} className="px-4 py-1.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary/90 transition-colors">Save</button>
      </header>
      <div className="flex gap-2 p-4 overflow-x-auto no-scrollbar">
        <button onClick={() => setCategory('Personal')} className={`flex items-center justify-center gap-1 h-8 shrink-0 rounded-full px-4 text-sm font-medium ${category === 'Personal' ? 'bg-primary/10 border border-primary/20 text-primary' : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
          <span className="material-symbols-outlined text-sm">label</span>Personal
        </button>
        <button onClick={() => setCategory('Work')} className={`flex items-center justify-center gap-1 h-8 shrink-0 rounded-full px-4 text-sm font-medium ${category === 'Work' ? 'bg-primary/10 border border-primary/20 text-primary' : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
          <span className="material-symbols-outlined text-sm">label</span>Work
        </button>
        <button onClick={() => setCategory('Ideas')} className={`flex items-center justify-center gap-1 h-8 shrink-0 rounded-full px-4 text-sm font-medium ${category === 'Ideas' ? 'bg-primary/10 border border-primary/20 text-primary' : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
          <span className="material-symbols-outlined text-sm">label</span>Ideas
        </button>
      </div>
      <main className="flex-1 flex flex-col px-4 space-y-4 overflow-y-auto">
        <div className="mt-2">
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-transparent border-none p-0 text-2xl font-bold placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-0 outline-none" placeholder="Note Title" type="text" />
        </div>
        <div className="flex-1">
          <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full h-full bg-transparent border-none p-0 text-base leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-0 outline-none resize-none" placeholder="Start writing your note here..."></textarea>
        </div>
      </main>
      <footer className="bg-background-light dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">format_bold</span></button>
          <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">format_italic</span></button>
          <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">format_list_bulleted</span></button>
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
          <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">format_quote</span></button>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">attach_file</span></button>
          <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">mic</span></button>
          <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">image</span></button>
        </div>
      </footer>
      <div className="h-8 bg-background-light dark:bg-background-dark"></div>
    </div>
  );
};

const TrashScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => (
  <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
    <header className="flex items-center justify-between p-4 pb-2">
      <div className="flex items-center gap-3">
        <button onClick={() => setScreen('settings')} className="flex size-10 items-center justify-center rounded-full bg-slate-200/50 dark:bg-slate-800/50">
          <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">arrow_back_ios_new</span>
        </button>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Trash</h2>
      </div>
      <button className="text-sm font-semibold text-primary">Empty Trash</button>
    </header>
    <div className="px-4 py-3">
      <div className="rounded-xl bg-slate-200/40 dark:bg-slate-800/40 p-3 flex items-start gap-3">
        <span className="material-symbols-outlined text-slate-500 text-lg mt-0.5">info</span>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Notes in the Trash are permanently deleted after 30 days. You can restore them or delete them manually before then.</p>
      </div>
    </div>
    <main className="flex-1 overflow-y-auto px-4 pt-2 pb-24">
      <div className="flex flex-col gap-3">
        <div className="group flex flex-col gap-3 p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">Old Weekly Grocery List</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 italic">Apples, bananas, almond milk, kale, and frozen berries...</p>
            </div>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider ml-4">12d left</span>
          </div>
          <div className="flex items-center justify-end gap-3 mt-1 pt-3 border-t border-slate-100 dark:border-slate-800/50">
            <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">restore_from_trash</span>Restore</button>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800"></div>
            <button className="flex items-center gap-1.5 text-xs font-semibold text-danger hover:brightness-110 transition-colors"><span className="material-symbols-outlined text-lg">delete_forever</span>Delete</button>
          </div>
        </div>
      </div>
    </main>
    <Navigation current="settings" setScreen={setScreen} />
  </div>
);

// --- Root App ---

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  const handleSaveNote = (noteData: Partial<Note>) => {
    if (editingNoteId) {
      setNotes(notes.map(n => n.id === editingNoteId ? { ...n, ...noteData } as Note : n));
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title: noteData.title || 'Untitled Note',
        content: noteData.content || '',
        category: noteData.category || 'Personal',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase(),
        ...noteData
      } as Note;
      setNotes([newNote, ...notes]);
    }
    setEditingNoteId(null);
    setScreen('dashboard');
  };

  const handleEditNote = (id: string) => {
    setEditingNoteId(id);
    setScreen('create');
  };

  const handleCreateNew = () => {
    setEditingNoteId(null);
    setScreen('create');
  };

  const renderScreen = () => {
    switch (screen) {
      case 'splash': return <SplashScreen onComplete={() => setScreen('login')} />;
      case 'login': return <LoginScreen onLogin={() => setScreen('dashboard')} />;
      case 'dashboard': return <DashboardScreen setScreen={setScreen} notes={notes} onEditNote={handleEditNote} onCreateNew={handleCreateNew} />;
      case 'folders': return <FoldersScreen setScreen={setScreen} />;
      case 'shared': return <SharedNoteScreen setScreen={setScreen} />;
      case 'settings': return <SettingsScreen setScreen={setScreen} />;
      case 'search': return <SearchScreen setScreen={setScreen} />;
      case 'create': return <CreateNoteScreen setScreen={setScreen} onSave={handleSaveNote} initialNote={notes.find(n => n.id === editingNoteId)} />;
      case 'trash': return <TrashScreen setScreen={setScreen} />;
      case 'reminders': return <RemindersScreen setScreen={setScreen} />;
      default: return <DashboardScreen setScreen={setScreen} notes={notes} onEditNote={handleEditNote} onCreateNew={handleCreateNew} />;
    }
  };

  // Helper to handle the 'shared' screen naming collision with SharedNoteScreen
  const SharedNoteScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => <SharedScreen setScreen={setScreen} />;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased">
      <div className="max-w-[430px] mx-auto min-h-screen relative bg-background-light dark:bg-background-dark border-x border-slate-200 dark:border-slate-800 shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
