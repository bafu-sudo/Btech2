export interface Student {
  id: string;
  name: string;
  instrument: string;
  avatar: string;
  level: 'Beginner' | 'Elementary' | 'Intermediate' | 'Advanced';
  noteReadingScore: number; // 0-100
  rhythmScore: number;      // 0-100
  scalesScore: number;      // 0-100
  quizzesScore: number;     // 0-100
  completedActivitiesCount: number;
  practiceStreakDays: number;
  totalPracticeMinutes: number;
  lastActive: string;
  encouragingFeedback: string;
  assignedBadges: string[];
}

export type AssignmentCategory =
  | 'cornet-exercise'
  | 'music-theory'
  | 'song-practice'
  | 'scale-practice'
  | 'rhythm-exercise'
  | 'quiz'
  | 'listening'
  | 'tuning-practice';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  category: AssignmentCategory;
  instrument: string; // 'All Brass' | 'Bb Cornet' | 'Euphonium' | 'Trombone' etc.
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  dueDate: string;
  instructions: string;
  estimatedMinutes: number;
  targetLink: {
    tab: 'musicTutor' | 'scales' | 'accidentals' | 'scores' | 'trombone' | 'percussion' | 'quiz' | 'tuner';
    label: string;
  };
  completedStudentIds: string[];
}

export interface GroupSection {
  id: string;
  name: string;
  instrument: string;
  leaderStudentName: string;
  weeklyGoal: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'assignment' | 'achievement' | 'quiz' | 'general';
}

export interface AchievementItem {
  id: string;
  title: string;
  icon: string;
  description: string;
  unlockedAt?: string;
  category: 'practice' | 'quiz' | 'theory' | 'repertoire';
}

export interface BrassBandGroup {
  id: string;
  name: string;
  groupType: 'church-band' | 'school-band' | 'community-band';
  leaderName: string;
  leaderTitle: string; // 'Bandmaster' | 'Music Director' | 'Teacher'
  description: string;
  organization: string; // e.g. 'National Youth Brass Band' or 'City Music Academy'
  students: Student[];
  assignments: Assignment[];
  sections: GroupSection[];
  notifications: NotificationItem[];
}
