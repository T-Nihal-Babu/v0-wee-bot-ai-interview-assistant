// Gamification and XP system utilities

export const INTERVIEWER_PERSONAS = [
  {
    id: "hr",
    name: "HR Interviewer",
    type: "hr",
    description: "Professional HR specialist focusing on soft skills and cultural fit",
    tone: "formal",
    difficulty: "beginner",
    icon: "👔",
  },
  {
    id: "technical",
    name: "Technical Interviewer",
    type: "technical",
    description: "Expert focusing on technical depth and problem-solving approach",
    tone: "analytical",
    difficulty: "intermediate",
    icon: "💻",
  },
  {
    id: "senior",
    name: "Senior Engineer",
    type: "senior_engineer",
    description: "Experienced engineer evaluating architecture and best practices",
    tone: "mentoring",
    difficulty: "advanced",
    icon: "🎯",
  },
  {
    id: "mentor",
    name: "Friendly Mentor",
    type: "friendly_mentor",
    description: "Supportive mentor helping you grow and gain confidence",
    tone: "encouraging",
    difficulty: "beginner",
    icon: "🤝",
  },
]

export const XP_REWARDS = {
  completeCommunication: 100,
  completeCoding: 150,
  perfectScore: 50,
  newRecord: 75,
  streak3Days: 100,
  streak7Days: 250,
}

export const BADGES = [
  { id: "first_interview", name: "First Interview", description: "Completed your first interview", icon: "🎬" },
  { id: "communication_master", name: "Communication Master", description: "Scored 90+ in communication", icon: "🗣️" },
  { id: "coding_ninja", name: "Coding Ninja", description: "Completed 10 coding challenges", icon: "⚡" },
  { id: "consistent", name: "Consistent Learner", description: "Maintained 7-day streak", icon: "🔥" },
  { id: "speed_demon", name: "Speed Demon", description: "Completed 5 interviews in one day", icon: "⚙️" },
  { id: "multi_skilled", name: "Multi-Skilled", description: "Completed both communication and coding", icon: "🎓" },
]

export const RANK_THRESHOLDS = [
  { rank: "Novice", minLevel: 1, minXP: 0 },
  { rank: "Apprentice", minLevel: 5, minXP: 2500 },
  { rank: "Professional", minLevel: 10, minXP: 5000 },
  { rank: "Expert", minLevel: 15, minXP: 7500 },
  { rank: "Master", minLevel: 20, minXP: 10000 },
  { rank: "Legend", minLevel: 25, minXP: 15000 },
]
