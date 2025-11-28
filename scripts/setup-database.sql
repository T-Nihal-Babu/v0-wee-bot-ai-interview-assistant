-- Create users table with user type
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  user_type VARCHAR(50) NOT NULL, -- 'candidate' or 'company'
  avatar_url VARCHAR(255),
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create gamification table for candidates
CREATE TABLE gamification (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  rank VARCHAR(50) DEFAULT 'Novice',
  badges TEXT[], -- JSON array of badges
  streak INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create interviewer personas
CREATE TABLE interviewer_personas (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'hr', 'technical', 'senior_engineer', 'friendly_mentor'
  description TEXT,
  tone VARCHAR(50),
  difficulty_level VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create interview templates for companies
CREATE TABLE interview_templates (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  job_role VARCHAR(255),
  difficulty VARCHAR(50),
  interviewer_persona_id INTEGER REFERENCES interviewer_personas(id),
  duration_minutes INTEGER,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create interview sessions
CREATE TABLE interview_sessions (
  id SERIAL PRIMARY KEY,
  candidate_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  template_id INTEGER REFERENCES interview_templates(id) ON DELETE SET NULL,
  interviewer_persona_id INTEGER REFERENCES interviewer_personas(id),
  session_type VARCHAR(50), -- 'communication' or 'coding'
  difficulty VARCHAR(50),
  job_role VARCHAR(255),
  transcript TEXT,
  video_url VARCHAR(255),
  code_submitted TEXT,
  score DECIMAL(5,2),
  communication_score DECIMAL(5,2),
  confidence_score DECIMAL(5,2),
  body_language_score DECIMAL(5,2),
  vocabulary_score DECIMAL(5,2),
  xp_earned INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT FALSE,
  public_link VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create candidate applications to company interviews
CREATE TABLE candidate_applications (
  id SERIAL PRIMARY KEY,
  candidate_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  template_id INTEGER REFERENCES interview_templates(id) ON DELETE CASCADE,
  company_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed'
  invite_link VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create feedback and improvements
CREATE TABLE improvements (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES interview_sessions(id) ON DELETE CASCADE,
  category VARCHAR(50), -- 'stuttering', 'grammar', 'confidence', etc.
  suggestion TEXT,
  resources TEXT[], -- JSON array of resource links
  timestamp_in_video INTEGER, -- milliseconds
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
