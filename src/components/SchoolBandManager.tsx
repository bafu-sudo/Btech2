import React, { useState } from 'react';
import {
  Users,
  GraduationCap,
  Music,
  PlusCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Award,
  Bell,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  BookOpen,
  Filter,
  Check,
  Flame,
  Volume2,
  HelpCircle,
  Eye,
  Settings,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { BrassBandGroup, Student, Assignment, AssignmentCategory } from '../data/groupTypes';
import { INITIAL_GROUPS, ALL_ACHIEVEMENTS } from '../data/groupData';

interface SchoolBandManagerProps {
  onNavigateToTab: (tab: 'musicTutor' | 'scales' | 'accidentals' | 'scores' | 'trombone' | 'percussion' | 'quiz' | 'tuner') => void;
}

export const SchoolBandManager: React.FC<SchoolBandManagerProps> = ({ onNavigateToTab }) => {
  // Groups State
  const [groups, setGroups] = useState<BrassBandGroup[]>(INITIAL_GROUPS);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(INITIAL_GROUPS[0].id);

  // Perspective: Teacher/Bandmaster Dashboard vs Student Practice View
  const [userRole, setUserRole] = useState<'teacher' | 'student'>('teacher');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('student-b'); // Default to Student B for learning view

  // Active Sub-tab in Manager
  const [activeSubTab, setActiveSubTab] = useState<
    'dashboard' | 'assignments' | 'students' | 'sections' | 'achievements' | 'create-group'
  >('dashboard');

  // Filter for students or assignments
  const [instrumentFilter, setInstrumentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // New Group Form State
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupOrg, setNewGroupOrg] = useState('');
  const [newGroupLeader, setNewGroupLeader] = useState('');
  const [newGroupType, setNewGroupType] = useState<'church-band' | 'school-band' | 'community-band'>('church-band');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [createdNotice, setCreatedNotice] = useState<string | null>(null);

  // New Assignment Modal / State
  const [showNewAssignmentModal, setShowNewAssignmentModal] = useState(false);
  const [newAsgTitle, setNewAsgTitle] = useState('');
  const [newAsgDesc, setNewAsgDesc] = useState('');
  const [newAsgCategory, setNewAsgCategory] = useState<AssignmentCategory>('scale-practice');
  const [newAsgInstrument, setNewAsgInstrument] = useState('All Brass');
  const [newAsgDifficulty, setNewAsgDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [newAsgDueDate, setNewAsgDueDate] = useState('Next Sunday 9:00 AM');
  const [newAsgInstructions, setNewAsgInstructions] = useState('');
  const [newAsgTargetTab, setNewAsgTargetTab] = useState<'musicTutor' | 'scales' | 'accidentals' | 'scores' | 'tuner'>('scales');

  // Notifications toggle/dropdown
  const [showNotifications, setShowNotifications] = useState(false);

  // Active Group
  const activeGroup = groups.find((g) => g.id === selectedGroupId) || groups[0];

  // Current logged in / simulated student
  const currentStudent =
    activeGroup.students.find((s) => s.id === selectedStudentId) ||
    activeGroup.students[0] || {
      id: 'student-demo',
      name: 'Student Guest',
      instrument: 'Bb Cornet',
      avatar: '🎺',
      level: 'Beginner',
      noteReadingScore: 75,
      rhythmScore: 80,
      scalesScore: 85,
      quizzesScore: 80,
      completedActivitiesCount: 5,
      practiceStreakDays: 3,
      totalPracticeMinutes: 90,
      lastActive: 'Today',
      encouragingFeedback: 'Keep up steady practice!',
      assignedBadges: ['first-lesson']
    };

  // Group Stats Calculations
  const totalStudents = activeGroup.students.length;
  const avgQuizScore = Math.round(
    activeGroup.students.reduce((acc, s) => acc + s.quizzesScore, 0) / (totalStudents || 1)
  );
  const avgNoteReading = Math.round(
    activeGroup.students.reduce((acc, s) => acc + s.noteReadingScore, 0) / (totalStudents || 1)
  );
  const avgScales = Math.round(
    activeGroup.students.reduce((acc, s) => acc + s.scalesScore, 0) / (totalStudents || 1)
  );
  const avgRhythm = Math.round(
    activeGroup.students.reduce((acc, s) => acc + s.rhythmScore, 0) / (totalStudents || 1)
  );

  const totalAssignmentsCount = activeGroup.assignments.length;
  const totalCompletedSubmissions = activeGroup.assignments.reduce(
    (acc, a) => acc + a.completedStudentIds.length,
    0
  );
  const possibleCompletions = totalAssignmentsCount * totalStudents || 1;
  const overallCompletionRate = Math.round((totalCompletedSubmissions / possibleCompletions) * 100);

  // Toggle student assignment completion
  const handleToggleStudentComplete = (assignmentId: string, studentId: string) => {
    setGroups((prev) =>
      prev.map((grp) => {
        if (grp.id !== activeGroup.id) return grp;
        return {
          ...grp,
          assignments: grp.assignments.map((asg) => {
            if (asg.id !== assignmentId) return asg;
            const alreadyCompleted = asg.completedStudentIds.includes(studentId);
            return {
              ...asg,
              completedStudentIds: alreadyCompleted
                ? asg.completedStudentIds.filter((id) => id !== studentId)
                : [...asg.completedStudentIds, studentId]
            };
          })
        };
      })
    );
  };

  // Create new group handler
  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const newGroup: BrassBandGroup = {
      id: `group-${Date.now()}`,
      name: newGroupName.trim(),
      groupType: newGroupType,
      leaderName: newGroupLeader.trim() || 'Bandmaster',
      leaderTitle: newGroupType === 'school-band' ? 'Music Director' : 'Bandmaster',
      organization: newGroupOrg.trim() || 'Brass Organization',
      description: newGroupDesc.trim() || 'Band practice and musicianship group.',
      students: [
        {
          id: `st-${Date.now()}-1`,
          name: 'Student 1 (Principal Cornet)',
          instrument: 'Bb Cornet',
          avatar: '🎺',
          level: 'Intermediate',
          noteReadingScore: 80,
          rhythmScore: 82,
          scalesScore: 85,
          quizzesScore: 88,
          completedActivitiesCount: 6,
          practiceStreakDays: 5,
          totalPracticeMinutes: 120,
          lastActive: 'Just now',
          encouragingFeedback: 'Good initial foundation. Continue practicing low notes and scales.',
          assignedBadges: ['first-lesson', 'first-instrument-exercise']
        },
        {
          id: `st-${Date.now()}-2`,
          name: 'Student 2 (Horn & Baritone)',
          instrument: 'Eb Tenor Horn',
          avatar: '🎷',
          level: 'Beginner',
          noteReadingScore: 70,
          rhythmScore: 75,
          scalesScore: 72,
          quizzesScore: 76,
          completedActivitiesCount: 4,
          practiceStreakDays: 3,
          totalPracticeMinutes: 80,
          lastActive: '1 day ago',
          encouragingFeedback: 'Consistent tempo. Focus on 2-flat scales.',
          assignedBadges: ['first-lesson']
        }
      ],
      sections: [
        { id: 's-1', name: 'Cornet Section', instrument: 'Cornets', leaderStudentName: 'Student 1', weeklyGoal: 'C & G Major scales' },
        { id: 's-2', name: 'Bass & Lower Brass', instrument: 'Euphonium & Basses', leaderStudentName: 'Student 2', weeklyGoal: 'Steady rhythmic foundation' }
      ],
      assignments: [
        {
          id: `asg-${Date.now()}-1`,
          title: 'Opening Week: C Major Scale & Fingerings',
          description: 'Learn the first 5 notes and complete scale.',
          category: 'scale-practice',
          instrument: 'All Brass',
          difficulty: 'Beginner',
          dueDate: 'Next Sunday',
          instructions: 'Practice in the All Brass Scales studio.',
          estimatedMinutes: 15,
          targetLink: { tab: 'scales', label: 'Open All Brass Scales Studio' },
          completedStudentIds: []
        }
      ],
      notifications: [
        {
          id: `n-${Date.now()}`,
          title: 'Group Created',
          message: `Welcome to ${newGroupName}! Your brass curriculum is ready.`,
          timestamp: 'Just now',
          read: false,
          type: 'general'
        }
      ]
    };

    setGroups([newGroup, ...groups]);
    setSelectedGroupId(newGroup.id);
    setCreatedNotice(`"${newGroup.name}" created successfully!`);
    setActiveSubTab('dashboard');
    setNewGroupName('');
    setNewGroupOrg('');
    setNewGroupLeader('');
    setNewGroupDesc('');
    setTimeout(() => setCreatedNotice(null), 4000);
  };

  // Create Assignment handler
  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsgTitle.trim()) return;

    const targetLabelMap: Record<string, string> = {
      scales: 'Open All Brass Scales Studio',
      musicTutor: 'Open Interactive Music Tutor',
      accidentals: 'Open Sharps & Flats Masterclass',
      scores: 'Open 25+ Free Scores Library',
      tuner: 'Open Digital Brass Tuner'
    };

    const newAsg: Assignment = {
      id: `asg-${Date.now()}`,
      title: newAsgTitle.trim(),
      description: newAsgDesc.trim() || 'Practice assignment.',
      category: newAsgCategory,
      instrument: newAsgInstrument,
      difficulty: newAsgDifficulty,
      dueDate: newAsgDueDate || 'Next Rehearsal',
      instructions: newAsgInstructions.trim() || 'Follow instructions and practice thoroughly.',
      estimatedMinutes: 15,
      targetLink: {
        tab: newAsgTargetTab,
        label: targetLabelMap[newAsgTargetTab] || 'Open Feature'
      },
      completedStudentIds: []
    };

    setGroups((prev) =>
      prev.map((grp) => {
        if (grp.id !== activeGroup.id) return grp;
        return {
          ...grp,
          assignments: [newAsg, ...grp.assignments],
          notifications: [
            {
              id: `notif-${Date.now()}`,
              title: 'New Activity Assigned',
              message: `New assignment: "${newAsg.title}" for ${newAsg.instrument}`,
              timestamp: 'Just now',
              read: false,
              type: 'assignment'
            },
            ...grp.notifications
          ]
        };
      })
    );

    setShowNewAssignmentModal(false);
    setNewAsgTitle('');
    setNewAsgDesc('');
    setNewAsgInstructions('');
  };

  // Filtered students
  const filteredStudents = activeGroup.students.filter((st) => {
    if (instrumentFilter !== 'all' && !st.instrument.toLowerCase().includes(instrumentFilter.toLowerCase())) {
      return false;
    }
    if (searchQuery && !st.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Category Icon helper
  const getCategoryIcon = (cat: AssignmentCategory) => {
    switch (cat) {
      case 'cornet-exercise':
        return '🎺';
      case 'music-theory':
        return '🎼';
      case 'song-practice':
        return '🎵';
      case 'scale-practice':
        return '📚';
      case 'rhythm-exercise':
        return '⏱️';
      case 'quiz':
        return '📝';
      case 'listening':
        return '🎧';
      case 'tuning-practice':
        return '🎛️';
      default:
        return '🎺';
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6 sm:py-10 space-y-8 animate-fadeIn">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 p-5 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              <span>School, Church Band & Bandmaster Platform</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white">
              School & Brass Band Mode
            </h1>
            <p className="max-w-2xl text-xs sm:text-sm text-slate-300">
              A comprehensive teaching suite for <strong>Bandmasters</strong>, <strong>School Music Departments</strong>, and <strong>Church Youth Bands</strong>. Assign structured practice connected to Btech2’s Music Tutor, Tuner, Scales & Repertoire, and celebrate individual student progress.
            </p>
          </div>

          {/* Perspective & Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* View As Toggle */}
            <div className="flex rounded-lg bg-slate-800/80 p-1 border border-slate-700">
              <button
                type="button"
                onClick={() => setUserRole('teacher')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  userRole === 'teacher'
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <GraduationCap className="h-3.5 w-3.5" />
                <span>Teacher / Bandmaster</span>
              </button>
              <button
                type="button"
                onClick={() => setUserRole('student')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  userRole === 'student'
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                <span>Student View</span>
              </button>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-lg bg-slate-800/80 p-2 text-slate-300 hover:text-amber-400 border border-slate-700 transition-colors"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="h-4 w-4" />
                {activeGroup.notifications.some((n) => !n.read) && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-800 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-md z-50">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                    <span className="text-xs font-bold text-amber-400">Activity Updates</span>
                    <span className="text-[10px] text-slate-400">{activeGroup.notifications.length} notifications</span>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {activeGroup.notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2 rounded-lg text-xs border ${
                          n.read
                            ? 'bg-slate-950/40 border-slate-800/60 text-slate-400'
                            : 'bg-amber-500/10 border-amber-500/30 text-slate-200'
                        }`}
                      >
                        <p className="font-semibold text-amber-300">{n.title}</p>
                        <p className="text-[11px] text-slate-300 mt-0.5">{n.message}</p>
                        <span className="text-[9px] text-slate-500 mt-1 block">{n.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Group Selector Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
              Active Group:
            </span>
            {groups.map((grp) => (
              <button
                key={grp.id}
                type="button"
                onClick={() => setSelectedGroupId(grp.id)}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  grp.id === selectedGroupId
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-semibold'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                }`}
              >
                {grp.groupType === 'church-band' ? '🎺' : '🏫'} {grp.name}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setActiveSubTab('create-group')}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1.5 text-xs font-medium transition-colors"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Create New Group</span>
          </button>
        </div>
      </div>

      {createdNotice && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-xs font-medium text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{createdNotice}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <nav className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveSubTab('dashboard')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeSubTab === 'dashboard'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            📊 {userRole === 'teacher' ? 'Bandmaster Dashboard' : 'My Practice Hub'}
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('assignments')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeSubTab === 'assignments'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            📋 Practice Assignments ({activeGroup.assignments.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('students')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeSubTab === 'students'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            👥 Student Progress & Skill Level
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('sections')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeSubTab === 'sections'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            🎺 Instrument Sections ({activeGroup.sections.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('achievements')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeSubTab === 'achievements'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            🏆 Achievements & Badges
          </button>
        </nav>

        {userRole === 'teacher' && activeSubTab === 'assignments' && (
          <button
            type="button"
            onClick={() => setShowNewAssignmentModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 text-xs font-bold transition-all shadow-md"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Create Assignment</span>
          </button>
        )}
      </div>

      {/* =====================================================================
          VIEW 1: TEACHER / BANDMASTER DASHBOARD OR STUDENT PRACTICE HUB
          ===================================================================== */}
      {activeSubTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Header Card with Group Metadata */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
                  <span>{activeGroup.organization}</span>
                  <span>•</span>
                  <span>{activeGroup.leaderTitle}: {activeGroup.leaderName}</span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white mt-1">
                  {activeGroup.name}
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  {activeGroup.description}
                </p>
              </div>

              {/* Group Type Badge */}
              <div className="inline-flex items-center gap-2 rounded-xl bg-slate-800/80 px-3 py-2 border border-slate-700/80">
                <span className="text-xl">
                  {activeGroup.groupType === 'church-band' ? '⛪' : '🏫'}
                </span>
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Group Type</p>
                  <p className="text-xs font-bold text-slate-200">
                    {activeGroup.groupType === 'church-band'
                      ? 'Salvation Army / Church Band'
                      : 'School Brass Curriculum'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* TEACHER PERSPECTIVE STATS */}
          {userRole === 'teacher' ? (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Total Students</span>
                    <Users className="h-4 w-4 text-amber-400" />
                  </div>
                  <p className="mt-2 text-2xl sm:text-3xl font-bold text-white">{totalStudents}</p>
                  <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                    <span>Active this week:</span>
                    <strong>{totalStudents}</strong>
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Overall Progress</span>
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                  </div>
                  <p className="mt-2 text-2xl sm:text-3xl font-bold text-white">{overallCompletionRate}%</p>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                    <div
                      className="bg-emerald-400 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${overallCompletionRate}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Average Quiz Score</span>
                    <Award className="h-4 w-4 text-amber-400" />
                  </div>
                  <p className="mt-2 text-2xl sm:text-3xl font-bold text-white">{avgQuizScore}%</p>
                  <p className="text-[11px] text-amber-400 mt-1">High Band Proficiency</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Active Assignments</span>
                    <BookOpen className="h-4 w-4 text-cyan-400" />
                  </div>
                  <p className="mt-2 text-2xl sm:text-3xl font-bold text-white">{totalAssignmentsCount}</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {totalCompletedSubmissions} submissions completed
                  </p>
                </div>
              </div>

              {/* Bandmaster Section Focus Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 cols: Quick Band Section Matrix */}
                <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif text-base font-bold text-amber-300">
                      Band Rehearsal Section Matrix
                    </h3>
                    <span className="text-xs text-slate-400">
                      {activeGroup.groupType === 'church-band' ? 'Sunday Rehearsal Layout' : 'Classroom Layout'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeGroup.sections.map((sec) => (
                      <div
                        key={sec.id}
                        className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-300">{sec.name}</span>
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                            {sec.instrument}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1.5">
                          <strong>Goal:</strong> {sec.weeklyGoal}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Section Leader: <span className="text-slate-200">{sec.leaderStudentName}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right col: Band Skill Radar Summary */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                  <h3 className="font-serif text-base font-bold text-amber-300">
                    Group Proficiency Breakdown
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">Scales & Fingerings</span>
                        <span className="font-bold text-amber-400">{avgScales}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div
                          className="bg-amber-400 h-2 rounded-full"
                          style={{ width: `${avgScales}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">Rhythm & Time Keeping</span>
                        <span className="font-bold text-emerald-400">{avgRhythm}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div
                          className="bg-emerald-400 h-2 rounded-full"
                          style={{ width: `${avgRhythm}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">Treble Staff Note Reading</span>
                        <span className="font-bold text-cyan-400">{avgNoteReading}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div
                          className="bg-cyan-400 h-2 rounded-full"
                          style={{ width: `${avgNoteReading}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">Theory & Transposition Quizzes</span>
                        <span className="font-bold text-purple-400">{avgQuizScore}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div
                          className="bg-purple-400 h-2 rounded-full"
                          style={{ width: `${avgQuizScore}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-[11px] text-amber-200">
                    💡 <strong>Bandmaster Note:</strong> Note reading averages are slightly below scale technique. Encourage students to spend 5 minutes with the interactive <strong>Music Tutor</strong> stave.
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* STUDENT PERSPECTIVE */
            <div className="space-y-6">
              {/* Student Profile Card */}
              <div className="rounded-xl border border-amber-500/30 bg-slate-900/80 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-3xl border border-amber-500/40">
                    {currentStudent.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-lg font-bold text-white">{currentStudent.name}</h3>
                      <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-500/40">
                        {currentStudent.level}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Instrument: <strong className="text-amber-400">{currentStudent.instrument}</strong> • Streak: <span className="text-amber-400">🔥 {currentStudent.practiceStreakDays} Days</span>
                    </p>
                  </div>
                </div>

                {/* Change simulated student selector */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Viewing as:</span>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    {activeGroup.students.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.instrument})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Student Weekly Assignments Checklist */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-amber-300">
                      This Week's Practice
                    </h3>
                    <p className="text-xs text-slate-400">
                      Step-by-step activities assigned by {activeGroup.leaderName}
                    </p>
                  </div>
                  <span className="text-xs bg-slate-800 text-amber-300 px-3 py-1 rounded-full font-semibold border border-slate-700">
                    {
                      activeGroup.assignments.filter((a) =>
                        a.completedStudentIds.includes(currentStudent.id)
                      ).length
                    }{' '}
                    of {activeGroup.assignments.length} Done
                  </span>
                </div>

                <div className="space-y-3">
                  {activeGroup.assignments.map((asg) => {
                    const isDone = asg.completedStudentIds.includes(currentStudent.id);
                    return (
                      <div
                        key={asg.id}
                        className={`rounded-xl border p-4 transition-all ${
                          isDone
                            ? 'border-emerald-500/30 bg-emerald-950/20'
                            : 'border-slate-800 bg-slate-950/70 hover:border-amber-500/40'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <span className="text-2xl mt-0.5">{getCategoryIcon(asg.category)}</span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-sm text-slate-200">
                                  {asg.title}
                                </h4>
                                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400 font-mono">
                                  {asg.difficulty}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 mt-1">{asg.description}</p>
                              <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-slate-400" />
                                  Due: {asg.dueDate}
                                </span>
                                <span>•</span>
                                <span>Est. {asg.estimatedMinutes} mins</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <button
                              type="button"
                              onClick={() => onNavigateToTab(asg.targetLink.tab)}
                              className="flex items-center gap-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-3 py-1.5 text-xs font-semibold transition-colors"
                            >
                              <span>Start Exercise</span>
                              <ExternalLink className="h-3 w-3" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleStudentComplete(asg.id, currentStudent.id)}
                              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                isDone
                                  ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                              }`}
                            >
                              {isDone ? (
                                <>
                                  <Check className="h-3.5 w-3.5" />
                                  <span>Completed</span>
                                </>
                              ) : (
                                <span>Mark Done</span>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Encouragement & Feedback for this student */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🌱</span>
                  <div>
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Teacher Feedback & Encouragement
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      "{currentStudent.encouragingFeedback}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          VIEW 2: ASSIGNMENTS MANAGEMENT (Full List + Creation)
          ===================================================================== */}
      {activeSubTab === 'assignments' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-white">
                Band & Classroom Assignments
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Practice tasks integrated directly into Btech2 learning modules.
              </p>
            </div>

            {userRole === 'teacher' && (
              <button
                type="button"
                onClick={() => setShowNewAssignmentModal(true)}
                className="flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 text-xs font-bold transition-all shadow-md self-start"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Add New Activity</span>
              </button>
            )}
          </div>

          {/* Assignments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeGroup.assignments.map((asg) => {
              const completedCount = asg.completedStudentIds.length;
              const percent = Math.round((completedCount / (totalStudents || 1)) * 100);

              return (
                <div
                  key={asg.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getCategoryIcon(asg.category)}</span>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                            {asg.category.replace('-', ' ')}
                          </span>
                          <h3 className="font-bold text-sm text-slate-100">{asg.title}</h3>
                        </div>
                      </div>
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                        {asg.difficulty}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-3">{asg.description}</p>

                    <div className="mt-3 rounded-lg bg-slate-950/60 p-3 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                      <p>
                        <strong>Instructions:</strong> {asg.instructions}
                      </p>
                      <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                        <span>For: {asg.instrument}</span>
                        <span>Due: {asg.dueDate}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {/* Progress Indicator */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Student Completion</span>
                        <span>
                          {completedCount} / {totalStudents} students ({percent}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5">
                        <div
                          className="bg-amber-400 h-1.5 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Launch into feature button */}
                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => onNavigateToTab(asg.targetLink.tab)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                      >
                        <span>{asg.targetLink.label}</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>

                      {userRole === 'student' && (
                        <button
                          type="button"
                          onClick={() => handleToggleStudentComplete(asg.id, currentStudent.id)}
                          className={`rounded px-2.5 py-1 text-xs font-semibold ${
                            asg.completedStudentIds.includes(currentStudent.id)
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-slate-800 text-slate-300 hover:text-white'
                          }`}
                        >
                          {asg.completedStudentIds.includes(currentStudent.id)
                            ? '✓ Done'
                            : 'Mark Done'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW 3: STUDENT PROGRESS & SKILL LEVEL (Individual performance)
          ===================================================================== */}
      {activeSubTab === 'students' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-white">
                Individual Student Progress & Skill Level
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Detailed metrics across Note Reading, Rhythm, Scales, and Quizzes with constructive feedback.
              </p>
            </div>

            {/* Filter and Search */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />

              <select
                value={instrumentFilter}
                onChange={(e) => setInstrumentFilter(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-400"
              >
                <option value="all">All Instruments</option>
                <option value="Cornet">Cornets & Flugel</option>
                <option value="Horn">Tenor Horn</option>
                <option value="Euphonium">Euphonium & Baritone</option>
                <option value="Trombone">Trombone</option>
                <option value="Bass">Basses (Eb / BBb)</option>
                <option value="Percussion">Percussion</option>
              </select>
            </div>
          </div>

          {/* Student Cards List */}
          <div className="space-y-4">
            {filteredStudents.map((st) => (
              <div
                key={st.id}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 hover:border-slate-700/80 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{st.avatar}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm sm:text-base text-white">{st.name}</h3>
                        <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-500/30">
                          {st.level}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {st.instrument} • Last active: {st.lastActive} • {st.totalPracticeMinutes} mins practice
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-amber-400 font-bold">
                      🔥 {st.practiceStreakDays} Day Streak
                    </span>
                    <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-300">
                      ✓ {st.completedActivitiesCount} Lessons Done
                    </span>
                  </div>
                </div>

                {/* Progress Bars Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/40 p-3 rounded-lg border border-slate-800/80">
                  {/* Note Reading */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Note Reading</span>
                      <span className="font-semibold text-amber-300">{st.noteReadingScore}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                      <div
                        className="bg-amber-400 h-1.5 rounded-full"
                        style={{ width: `${st.noteReadingScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Rhythm */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Rhythm</span>
                      <span className="font-semibold text-emerald-400">{st.rhythmScore}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                      <div
                        className="bg-emerald-400 h-1.5 rounded-full"
                        style={{ width: `${st.rhythmScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Scales */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Scales</span>
                      <span className="font-semibold text-cyan-400">{st.scalesScore}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                      <div
                        className="bg-cyan-400 h-1.5 rounded-full"
                        style={{ width: `${st.scalesScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Quizzes */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Quizzes</span>
                      <span className="font-semibold text-purple-400">{st.quizzesScore}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                      <div
                        className="bg-purple-400 h-1.5 rounded-full"
                        style={{ width: `${st.quizzesScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Constructive Positive Recommendation */}
                <div className="flex items-start gap-2 text-xs text-slate-300 bg-amber-500/5 p-3 rounded-lg border border-amber-500/20">
                  <span className="text-amber-400 text-sm">💡</span>
                  <div>
                    <strong className="text-amber-300">Teacher Observation:</strong>{' '}
                    <span>{st.encouragingFeedback}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW 4: INSTRUMENT SECTIONS (Brass Band Sectional Breakdown)
          ===================================================================== */}
      {activeSubTab === 'sections' && (
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="font-serif text-xl font-bold text-white">
              Brass Band & Ensemble Sections
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Organize rehearsal by instrument sections matching traditional British Brass Band and Salvation Army seating.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeGroup.sections.map((sec) => {
              const studentsInSection = activeGroup.students.filter((s) =>
                s.instrument.toLowerCase().includes(sec.instrument.toLowerCase().split(' ')[0])
              );

              return (
                <div
                  key={sec.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-amber-300">{sec.name}</h3>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                        {sec.instrument}
                      </span>
                    </div>

                    <div className="mt-3 rounded-lg bg-slate-950/60 p-3 border border-slate-800 text-xs space-y-1">
                      <p className="text-slate-300">
                        <strong>Weekly Section Goal:</strong> {sec.weeklyGoal}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Section Leader: <span className="text-slate-200">{sec.leaderStudentName}</span>
                      </p>
                    </div>

                    <div className="mt-3">
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">
                        Students in Section:
                      </p>
                      <div className="space-y-1.5">
                        {studentsInSection.length > 0 ? (
                          studentsInSection.map((s) => (
                            <div
                              key={s.id}
                              className="flex items-center justify-between text-xs bg-slate-800/40 px-2 py-1 rounded"
                            >
                              <span className="text-slate-200">{s.name}</span>
                              <span className="text-amber-400 text-[10px] font-mono">
                                Scales: {s.scalesScore}%
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-[11px] text-slate-500 italic">No assigned students yet</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => onNavigateToTab('scales')}
                      className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
                    >
                      <span>Section Scales</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigateToTab('scores')}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Section Scores
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW 5: ACHIEVEMENTS & BADGES
          ===================================================================== */}
      {activeSubTab === 'achievements' && (
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="font-serif text-xl font-bold text-white">
              Student Achievements & Milestones
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Recognize student effort and discipline with digital brass badges and practice streaks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ALL_ACHIEVEMENTS.map((ach) => (
              <div
                key={ach.id}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2 hover:border-amber-500/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{ach.icon}</span>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-100">{ach.title}</h3>
                    <span className="text-[10px] uppercase font-bold text-amber-400">
                      {ach.category}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-400">{ach.description}</p>
                <div className="pt-2 text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Available to all students</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW 6: CREATE NEW GROUP
          ===================================================================== */}
      {activeSubTab === 'create-group' && (
        <div className="max-w-2xl mx-auto rounded-xl border border-slate-800 bg-slate-900/70 p-6 space-y-6">
          <div>
            <h2 className="font-serif text-xl font-bold text-white">Create a New Brass Group</h2>
            <p className="text-xs text-slate-400 mt-1">
              Set up a class or youth band with tailored assignments and progress tracking.
            </p>
          </div>

          <form onSubmit={handleCreateGroup} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Group Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Salvation Army Harare Central Band or St. George's College Brass"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Organization / School
                </label>
                <input
                  type="text"
                  placeholder="e.g. Brookhurst School or Salvation Army"
                  value={newGroupOrg}
                  onChange={(e) => setNewGroupOrg(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Bandmaster / Teacher Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bandmaster J. Smith"
                  value={newGroupLeader}
                  onChange={(e) => setNewGroupLeader(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Group Category
              </label>
              <select
                value={newGroupType}
                onChange={(e) => setNewGroupType(e.target.value as any)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              >
                <option value="church-band">Church Brass Band (Salvation Army / Ministry)</option>
                <option value="school-band">School Brass Class / Academy Band</option>
                <option value="community-band">Community / Youth Brass Band</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Description & Goals
              </label>
              <textarea
                rows={3}
                placeholder="Weekly rehearsals, learning goals, performance dates..."
                value={newGroupDesc}
                onChange={(e) => setNewGroupDesc(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setActiveSubTab('dashboard')}
                className="rounded-lg px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 text-xs font-bold transition-all shadow"
              >
                Create Group
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =====================================================================
          MODAL: CREATE ASSIGNMENT
          ===================================================================== */}
      {showNewAssignmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-white">Create New Assignment</h3>
              <button
                type="button"
                onClick={() => setShowNewAssignmentModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunday Practice – Week 5: G Major Scale & Arpeggio"
                  value={newAsgTitle}
                  onChange={(e) => setNewAsgTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Brief summary of the learning objective"
                  value={newAsgDesc}
                  onChange={(e) => setNewAsgDesc(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Activity Type
                  </label>
                  <select
                    value={newAsgCategory}
                    onChange={(e) => setNewAsgCategory(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="scale-practice">📚 Scale Practice</option>
                    <option value="cornet-exercise">🎺 Cornet / Instrument Exercise</option>
                    <option value="song-practice">🎵 Song Practice</option>
                    <option value="music-theory">🎼 Music Theory</option>
                    <option value="rhythm-exercise">⏱️ Rhythm Exercise</option>
                    <option value="quiz">📝 Quiz</option>
                    <option value="tuning-practice">🎛️ Tuning Practice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Instrument Target
                  </label>
                  <select
                    value={newAsgInstrument}
                    onChange={(e) => setNewAsgInstrument(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="All Brass">All Brass Instruments</option>
                    <option value="Bb Cornet">Bb Cornet</option>
                    <option value="Eb Tenor Horn">Eb Tenor Horn</option>
                    <option value="Bb Euphonium">Bb Euphonium / Baritone</option>
                    <option value="Trombone">Trombone</option>
                    <option value="Eb / BBb Bass">Eb / BBb Bass</option>
                    <option value="Percussion">Percussion</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Btech2 Module
                  </label>
                  <select
                    value={newAsgTargetTab}
                    onChange={(e) => setNewAsgTargetTab(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="scales">All Brass Scales Studio</option>
                    <option value="musicTutor">Interactive Music Tutor</option>
                    <option value="accidentals">Sharps & Flats Masterclass</option>
                    <option value="scores">25+ Free Scores Repertoire</option>
                    <option value="tuner">Digital Brass Tuner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="text"
                    value={newAsgDueDate}
                    onChange={(e) => setNewAsgDueDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Practice Instructions
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Play through 3 times with synth audio, observe 1st and 3rd valve trigger..."
                  value={newAsgInstructions}
                  onChange={(e) => setNewAsgInstructions(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewAssignmentModal(false)}
                  className="rounded-lg px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 text-xs font-bold transition-all shadow"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
