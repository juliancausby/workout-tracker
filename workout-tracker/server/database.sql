-- User information
CREATE TABLE users (
    id SERIAL PRIMARY KEY, -- Each user gets their own unique ID incrementing in 1
    email VARCHAR(255) UNIQUE NOT NULL,
    hashpass VARCHAR(255) NOT NULL,
    user_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workout information
CREATE TABLE workouts (
    id SERIAL PRIMARY KEY, -- Each workout gets their own unique ID incrementing in 1
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, -- Workout will belong to a specific user -- If user gets deleted so does their workotus
    workout_name varchar(50) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exercises within a workout
CREATE TABLE exercises (
    id SERIAL PRIMARY KEY,
    workout_id INTEGER REFERENCES workouts(id) ON DELETE CASCADE,
    exercise_name varchar(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Specific sets table for the ability to customize weight and reps per set
CREATE TABLE exercise_sets (
    id SERIAL PRIMARY KEY,
    exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
    set_number INTEGER NOT NULL,
    reps INTEGER NOT NULL,
    weight DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Template workout to be made by the user, so they can reuse
CREATE TABLE workout_templates (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table to hold exercises in the workout templates
CREATE TABLE template_exercises (
    id SERIAL PRIMARY KEY,
    template_id INTEGER REFERENCES workout_templates(id) ON DELETE CASCADE,
    exercise_name VARCHAR(100) NOT NULL,
    target_sets INTEGER,
    target_reps_min INTEGER
);