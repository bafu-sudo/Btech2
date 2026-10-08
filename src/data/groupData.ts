import { BrassBandGroup, AchievementItem } from './groupTypes';

export const ALL_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'first-lesson',
    title: 'First Lesson Completed',
    icon: '🏆',
    description: 'Finished your first guided brass lesson on Btech2.',
    category: 'practice',
    unlockedAt: 'Completed'
  },
  {
    id: 'first-instrument-exercise',
    title: 'First Instrument Exercise',
    icon: '🎺',
    description: 'Practiced valve fingerings or slide positions on your instrument.',
    category: 'practice',
    unlockedAt: 'Completed'
  },
  {
    id: 'note-reading-beginner',
    title: 'Note Reading Beginner',
    icon: '🎼',
    description: 'Learned treble staff ledger lines, flats and sharps.',
    category: 'theory',
    unlockedAt: 'Completed'
  },
  {
    id: '7-day-streak',
    title: '7 Day Practice Streak',
    icon: '🔥',
    description: 'Practiced consistently every day for a full week.',
    category: 'practice',
    unlockedAt: 'Unlocked'
  },
  {
    id: 'theory-learner',
    title: 'Theory Learner',
    icon: '📚',
    description: 'Mastered circle of fifths, transposition, and key signatures.',
    category: 'theory',
    unlockedAt: 'Unlocked'
  },
  {
    id: 'rhythm-practice',
    title: 'Rhythm Practice Champion',
    icon: '🎵',
    description: 'Accurately clapped or played 4/4 and 6/8 march rhythms.',
    category: 'practice',
    unlockedAt: 'Completed'
  },
  {
    id: 'quiz-achievement',
    title: 'Brass Quiz Distinction',
    icon: '🎖️',
    description: 'Scored 85%+ on a comprehensive British Brass Band theory quiz.',
    category: 'quiz',
    unlockedAt: 'Completed'
  },
  {
    id: 'tuning-master',
    title: 'Pitch & Tuning Ace',
    icon: '🎛️',
    description: 'Adjusted main tuning slide and held steady concert pitch.',
    category: 'practice',
    unlockedAt: 'Completed'
  }
];

export const INITIAL_GROUPS: BrassBandGroup[] = [
  {
    id: 'group-academy-youth',
    name: 'Academy Youth Brass Band',
    groupType: 'community-band',
    leaderName: 'Bandmaster Nokuvimba Bafu',
    leaderTitle: 'Bandmaster',
    organization: 'Btech2 Brass Music Academy',
    description: 'Young brass players developing musicianship, tone production, sight-reading, and ensemble discipline.',
    students: [
      {
        id: 'student-a',
        name: 'Student A (Tariro Chikore)',
        instrument: 'Bb Cornet',
        avatar: '🎺',
        level: 'Intermediate',
        noteReadingScore: 85,
        rhythmScore: 78,
        scalesScore: 92,
        quizzesScore: 90,
        completedActivitiesCount: 14,
        practiceStreakDays: 8,
        totalPracticeMinutes: 240,
        lastActive: 'Today at 09:15 AM',
        encouragingFeedback: 'Excellent scale fluency! Continue building confidence with syncopated 6/8 rhythms.',
        assignedBadges: ['first-lesson', 'first-instrument-exercise', '7-day-streak', 'quiz-achievement']
      },
      {
        id: 'student-b',
        name: 'Student B (Blessing Moyo)',
        instrument: 'Eb Tenor Horn',
        avatar: '🎷',
        level: 'Beginner',
        noteReadingScore: 60,
        rhythmScore: 88,
        scalesScore: 70,
        quizzesScore: 75,
        completedActivitiesCount: 9,
        practiceStreakDays: 4,
        totalPracticeMinutes: 165,
        lastActive: 'Yesterday',
        encouragingFeedback: 'Student B has great rhythmic timing. May benefit from extra practice with note reading on ledger lines and 3-sharp scales.',
        assignedBadges: ['first-lesson', 'rhythm-practice', 'first-instrument-exercise']
      },
      {
        id: 'student-c',
        name: 'Student C (Kudzai Ndlovu)',
        instrument: 'Bb Euphonium',
        avatar: '🎺',
        level: 'Intermediate',
        noteReadingScore: 88,
        rhythmScore: 84,
        scalesScore: 86,
        quizzesScore: 82,
        completedActivitiesCount: 12,
        practiceStreakDays: 6,
        totalPracticeMinutes: 210,
        lastActive: 'Today at 08:30 AM',
        encouragingFeedback: 'Warm, rich tone on countermelodies. Ready to tackle rapid 16th-note arpeggio runs in British marches.',
        assignedBadges: ['first-lesson', 'first-instrument-exercise', 'theory-learner']
      },
      {
        id: 'student-d',
        name: 'Student D (Farai Mutasa)',
        instrument: 'Tenor Trombone',
        avatar: '🎵',
        level: 'Beginner',
        noteReadingScore: 72,
        rhythmScore: 70,
        scalesScore: 68,
        quizzesScore: 74,
        completedActivitiesCount: 8,
        practiceStreakDays: 3,
        totalPracticeMinutes: 130,
        lastActive: '2 days ago',
        encouragingFeedback: 'Great progress learning 6th and 7th slide positions. Extra tuning slide checks recommended for low F and C.',
        assignedBadges: ['first-lesson', 'first-instrument-exercise']
      },
      {
        id: 'student-e',
        name: 'Student E (Chipo Sithole)',
        instrument: 'Bb Flugelhorn',
        avatar: '🎺',
        level: 'Intermediate',
        noteReadingScore: 92,
        rhythmScore: 90,
        scalesScore: 94,
        quizzesScore: 95,
        completedActivitiesCount: 16,
        practiceStreakDays: 12,
        totalPracticeMinutes: 310,
        lastActive: 'Today at 10:00 AM',
        encouragingFeedback: 'Outstanding lyrical expression and pitch accuracy across the entire octave register.',
        assignedBadges: ['first-lesson', 'first-instrument-exercise', '7-day-streak', 'quiz-achievement', 'tuning-master']
      },
      {
        id: 'student-f',
        name: 'Student F (Tatenda Musoni)',
        instrument: 'Eb Bass (Tuba)',
        avatar: '🎵',
        level: 'Beginner',
        noteReadingScore: 65,
        rhythmScore: 80,
        scalesScore: 66,
        quizzesScore: 70,
        completedActivitiesCount: 7,
        practiceStreakDays: 2,
        totalPracticeMinutes: 110,
        lastActive: '3 days ago',
        encouragingFeedback: 'Strong rhythmic foundation for the whole band! Recommended focus: low ledger-line note identification.',
        assignedBadges: ['first-lesson', 'rhythm-practice']
      }
    ],
    sections: [
      { id: 'sec-cornets', name: 'Cornet Section', instrument: 'Cornets & Flugel', leaderStudentName: 'Student A', weeklyGoal: 'Melody clarity and clean articulation' },
      { id: 'sec-horns', name: 'Horn Section', instrument: 'Eb Tenor Horns', leaderStudentName: 'Student B', weeklyGoal: 'Steady off-beat accompaniment & pitch center' },
      { id: 'sec-euph-baritone', name: 'Euphonium & Baritone Section', instrument: 'Bb Euphonium & Baritone', leaderStudentName: 'Student C', weeklyGoal: 'Countermelody & sustained breath support' },
      { id: 'sec-trombones', name: 'Trombone Section', instrument: 'Tenor & Bass Trombone', leaderStudentName: 'Student D', weeklyGoal: 'Rapid slide transitions 1st to 6th position' },
      { id: 'sec-basses', name: 'Bass Section', instrument: 'Eb Bass & BBb Bass', leaderStudentName: 'Student F', weeklyGoal: 'Fundamental pulse & low register projection' }
    ],
    assignments: [
      {
        id: 'asg-1',
        title: 'Weekly Practice – Week 4: C Major Scale Mastery',
        description: 'Practice the full 8-note octave scale with smooth legato and crisp staccato tonguing.',
        category: 'scale-practice',
        instrument: 'All Brass',
        difficulty: 'Beginner',
        dueDate: 'Sunday 10:00 AM',
        instructions: 'Open Btech2 All Scales Studio. Listen to the demo synthesizer, practice with valve guide, and play along at 80 BPM.',
        estimatedMinutes: 15,
        targetLink: { tab: 'scales', label: 'Open All Brass Scales Studio' },
        completedStudentIds: ['student-a', 'student-c', 'student-e']
      },
      {
        id: 'asg-2',
        title: 'Cornet & Horn Fingering System Practice',
        description: 'Drill natural and accidental valve fingerings on the interactive Music Tutor stave.',
        category: 'cornet-exercise',
        instrument: 'Bb Cornet / Eb Horn',
        difficulty: 'Beginner',
        dueDate: 'Friday 6:00 PM',
        instructions: 'Test each note on the staff: observe valve combinations (e.g., 1+2 for A4, 1+3 for D4). Listen to the synthesized pitch.',
        estimatedMinutes: 20,
        targetLink: { tab: 'musicTutor', label: 'Launch Interactive Music Tutor' },
        completedStudentIds: ['student-a', 'student-b', 'student-e']
      },
      {
        id: 'asg-3',
        title: 'Sharps & Flats Accidental Masterclass Quiz',
        description: 'Understand key signatures and why Bb Cornet transposes 2 sharps up from concert pitch.',
        category: 'quiz',
        instrument: 'All Brass',
        difficulty: 'Beginner',
        dueDate: 'Saturday 8:00 PM',
        instructions: 'Review the Sharps & Flats Masterclass module, then complete the 5-question quick test to check your key signature fluency.',
        estimatedMinutes: 15,
        targetLink: { tab: 'accidentals', label: 'Open Sharps & Flats Masterclass' },
        completedStudentIds: ['student-a', 'student-c', 'student-e']
      },
      {
        id: 'asg-4',
        title: 'Full Band Hymn: "Amazing Grace" (New Britain)',
        description: 'Practice melody and harmony parts for band rehearsal.',
        category: 'song-practice',
        instrument: 'All Brass',
        difficulty: 'Intermediate',
        dueDate: 'Sunday 9:00 AM',
        instructions: 'Open 25+ Free Scores Library, select Amazing Grace, adjust tempo to 72 BPM, and play your transposed part.',
        estimatedMinutes: 25,
        targetLink: { tab: 'scores', label: 'Open 25+ Free Scores Library' },
        completedStudentIds: ['student-a', 'student-e']
      },
      {
        id: 'asg-5',
        title: 'Instrument Tuning & Pitch Verification',
        description: 'Warm up mouthpiece, blow steady open G, and tune with digital Tuner needle.',
        category: 'tuning-practice',
        instrument: 'All Brass',
        difficulty: 'Beginner',
        dueDate: 'Sunday 8:30 AM',
        instructions: 'Use the Btech2 Tuner tool with your microphone. Adjust main tuning slide until the needle locks at 0 cents.',
        estimatedMinutes: 10,
        targetLink: { tab: 'tuner', label: 'Open Digital Brass Tuner' },
        completedStudentIds: ['student-a', 'student-c', 'student-e']
      }
    ],
    notifications: [
      {
        id: 'notif-1',
        title: 'New Band Practice Assigned',
        message: 'Bandmaster Nokuvimba Bafu posted Weekly Practice – Week 4 activities.',
        timestamp: '2 hours ago',
        read: false,
        type: 'assignment'
      },
      {
        id: 'notif-2',
        title: 'Activity Progress Milestone',
        message: 'You have completed 3 learning activities this week! Keep the momentum going.',
        timestamp: '1 day ago',
        read: false,
        type: 'achievement'
      },
      {
        id: 'notif-3',
        title: 'Theory Quiz Available',
        message: 'Your bandmaster added a new Sharps & Flats Transposition quiz.',
        timestamp: '2 days ago',
        read: true,
        type: 'quiz'
      }
    ]
  },
  {
    id: 'group-community-brass',
    name: 'Community Youth Brass Band',
    groupType: 'school-band',
    leaderName: 'Music Department / Mr. K. Henderson',
    leaderTitle: 'Music Director',
    organization: 'Civic Music Academy',
    description: 'Brass training program for young musicians covering foundational sight-reading, ensemble discipline, and concert repertoire.',
    students: [
      {
        id: 'st-b-1',
        name: 'Liam Vance',
        instrument: 'Bb Trumpet',
        avatar: '🎺',
        level: 'Intermediate',
        noteReadingScore: 90,
        rhythmScore: 85,
        scalesScore: 88,
        quizzesScore: 92,
        completedActivitiesCount: 15,
        practiceStreakDays: 9,
        totalPracticeMinutes: 260,
        lastActive: 'Today at 11:20 AM',
        encouragingFeedback: 'Consistent high marks in theory and pitch clarity. Ready for high G and A melodic solo passages.',
        assignedBadges: ['first-lesson', 'first-instrument-exercise', '7-day-streak', 'quiz-achievement']
      },
      {
        id: 'st-b-2',
        name: 'Amina El-Amin',
        instrument: 'Tenor Trombone',
        avatar: '🎵',
        level: 'Beginner',
        noteReadingScore: 68,
        rhythmScore: 86,
        scalesScore: 72,
        quizzesScore: 78,
        completedActivitiesCount: 10,
        practiceStreakDays: 5,
        totalPracticeMinutes: 175,
        lastActive: 'Today at 08:45 AM',
        encouragingFeedback: 'Amina demonstrates fantastic natural rhythm! Additional practice with Treble to Bass clef note conversion will build full confidence.',
        assignedBadges: ['first-lesson', 'rhythm-practice', 'first-instrument-exercise']
      },
      {
        id: 'st-b-3',
        name: 'Ethan Zhang',
        instrument: 'Bb Euphonium',
        avatar: '🎺',
        level: 'Intermediate',
        noteReadingScore: 84,
        rhythmScore: 80,
        scalesScore: 82,
        quizzesScore: 86,
        completedActivitiesCount: 11,
        practiceStreakDays: 4,
        totalPracticeMinutes: 190,
        lastActive: 'Yesterday',
        encouragingFeedback: 'Smooth warm tone. Continuing focus on fast 4th-valve trigger transitions for low C and B natural.',
        assignedBadges: ['first-lesson', 'first-instrument-exercise']
      },
      {
        id: 'st-b-4',
        name: 'Nia Moyo',
        instrument: 'Percussion & Glockenspiel',
        avatar: '🥁',
        level: 'Beginner',
        noteReadingScore: 82,
        rhythmScore: 94,
        scalesScore: 76,
        quizzesScore: 88,
        completedActivitiesCount: 13,
        practiceStreakDays: 7,
        totalPracticeMinutes: 220,
        lastActive: 'Today at 09:30 AM',
        encouragingFeedback: 'Exceptional tempo keeping and drum rudiments! Keep expanding glockenspiel two-mallet scale coordination.',
        assignedBadges: ['first-lesson', 'rhythm-practice', '7-day-streak']
      }
    ],
    sections: [
      { id: 'b-sec-trumpets', name: 'Trumpet Section', instrument: 'Bb Trumpets', leaderStudentName: 'Liam Vance', weeklyGoal: 'Clean staccato articulation on March of the Brass' },
      { id: 'b-sec-trombones', name: 'Trombone Section', instrument: 'Trombones', leaderStudentName: 'Amina El-Amin', weeklyGoal: 'Accurate 4th and 5th position intonation' },
      { id: 'b-sec-percussion', name: 'Percussion Ensemble', instrument: 'Side Drum & Glockenspiel', leaderStudentName: 'Nia Moyo', weeklyGoal: 'Dynamic contrasts between pp and ff' }
    ],
    assignments: [
      {
        id: 'asg-b1',
        title: 'Weekly Assignment: F Major & Bb Major Scales',
        description: 'Complete both 1-flat and 2-flat major scales on your instrument.',
        category: 'scale-practice',
        instrument: 'All Brass',
        difficulty: 'Beginner',
        dueDate: 'Wednesday 3:30 PM',
        instructions: 'Practice both scales 3 times with interactive audio feedback in the All Brass Scales studio.',
        estimatedMinutes: 15,
        targetLink: { tab: 'scales', label: 'Open All Brass Scales Studio' },
        completedStudentIds: ['st-b-1', 'st-b-3', 'st-b-4']
      },
      {
        id: 'asg-b2',
        title: 'British Brass Band March: "Floral Dance"',
        description: 'Learn the lively 6/8 opening melody and accompaniment section.',
        category: 'song-practice',
        instrument: 'All Brass',
        difficulty: 'Intermediate',
        dueDate: 'Friday 4:00 PM',
        instructions: 'Select Floral Dance in the 25+ Free Scores Library, practice along with the synthesized band accompaniment.',
        estimatedMinutes: 20,
        targetLink: { tab: 'scores', label: 'Open 25+ Free Scores Library' },
        completedStudentIds: ['st-b-1', 'st-b-4']
      },
      {
        id: 'asg-b3',
        title: 'Percussion & Drum Kit Rhythm Lab',
        description: 'Explore the interactive drum kit, snare rudiments and glockenspiel bells.',
        category: 'rhythm-exercise',
        instrument: 'Percussion',
        difficulty: 'Beginner',
        dueDate: 'Thursday 5:00 PM',
        instructions: 'Visit the Percussion Lab tab to practice paradiddles and glockenspiel mallet positions.',
        estimatedMinutes: 15,
        targetLink: { tab: 'percussion', label: 'Open Percussion & Drum Kit Lab' },
        completedStudentIds: ['st-b-4']
      }
    ],
    notifications: [
      {
        id: 'nb-1',
        title: 'Class Assignment Posted',
        message: 'Mr. Henderson posted the Week 5 Repertoire practice goals.',
        timestamp: '1 hour ago',
        read: false,
        type: 'assignment'
      },
      {
        id: 'nb-2',
        title: 'Sectional Rehearsal Reminder',
        message: 'Trombone and Euphonium sectional practice tomorrow at lunch.',
        timestamp: '5 hours ago',
        read: true,
        type: 'general'
      }
    ]
  }
];

