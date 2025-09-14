const express = require('express');
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcryptjs');  
const jwt = require('jsonwebtoken'); 

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Adds route to check what tables are in the database
app.get('/api/tables', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `);
      res.json({ 
        message: 'Database tables:', 
        tables: result.rows.map(row => row.table_name)
      });
    } catch (err) {
      res.json({ error: err.message });
    }
  });

// API Endpoint for User registration 
// Post instead of Get because its more secure
app.post('/api/register', async (req, res) => {

    try {
        // Grab the data the user is inputting
        const { email, password, user_name } = req.body;

        // Check if the user already exists or not by checking if the email is unique
        const userExists = await pool.query(
            'SELECT * FROM users WHERE email = $1', [email]
        );
        
        // If not, send an error that the user already exists
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password to be ready for input into the database
        const level = 20;
        const hashpass = await bcrypt.hash(password, level)

        // Create the new user
        const newUser = await pool.query(
            'INSERT INTO users (email, hashpass, user_name) VALUES ($1, $2, $3) RETURNING id, email, user_name',
            [email, hashpass, user_name]
        );
        
        // If successfully added, add the user and send a successful message
        res.json({
            message: 'User created successfully',
            user: newUser.rows[0]
        });

    }
    // If anything goes wrong, an error is sent to the user
    catch (err) {
        res.status(500).json({ error: err.message });
      }
      
})

// Endpoint for logging into an account
app.post('/api/login', async (req, res) => {
    try {
        // Grab data from the user
        const { email, password } = req.body;
        
        // Look for a user in the database with the inputted email
        const user = await pool.query(
            'SELECT * FROM users WHERE email = $1', [email]
          );
        
        // If no email is found in the database, return an error message
        if (user.rows.length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }
        
        // Encrypt the inputted user password and check if the database holds the encrypted version
        const passCheck = await bcrypt.compare(password, user.rows[0].hashpass);

        // If password is invalid, return the same error message as before
        // Error message must be the same so unwanted users don't know which emails exist within the database
        if (!passCheck) {
            return res.status(400).json({ error: 'User not found' });
          }
        
        // Uses JWT Authentication to allow users to stay logged in for 12 hours at a time
        const jwt = require('jsonwebtoken');
        const token = jwt.sign(
            { userId: user.rows[0].id }, 
            'access', 
            { expiresIn: '12h' }
        );

        // Once login is successful
        res.json({
            message: '✅ Logging in! ✅',
            token: token,
            user: {
              id: user.rows[0].id,
              email: user.rows[0].email,
              user_name: user.rows[0].user_name
            }
          });

    }
    // If anything goes wrong, an error is sent to the user
    catch (err) {
        res.status(500).json({ error: err.message });
      }
})

app.post('/api/workouts', async (req, res) => {

    try {
        // Grab data from user
        const {workout_name, date, description} = req.body;

        // Currently hardcoded into a single user
        const user_id = 1;

        // Insert into all workouts database
        const newWorkout = await pool.query(
            'INSERT INTO workouts (user_id, workout_name,date,description) VALUES ($1, $2, $3, $4) RETURNING *',
            [user_id, workout_name, date, description]
        )

        // If successfully added, add the workout to the users database
        res.json({
            message: 'Workout created successfully',
            workout: newWorkout.rows[0]
        })
    }
    // If anything goes wrong, an error is sent to the user
    catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.post('/api/workouts/:workout_id/exercises', async(req, res) => {
    try {

        // Uses a specific workout ID
        const {workout_id} = req.params;

        // Grab data from user
        const {exercise_name, description} = req.body;

        // Insert into specific workout database
        const newExercise = await pool.query(
            'INSERT INTO exercises (workout_id, exercise_name, description) VALUES ($1, $2, $3) RETURNING *',
            [workout_id, exercise_name, description] 
        )

        // Success message for adding an exercise
        res.json({
            message: 'Exercise added successfully!',
            exercise: newExercise.rows[0]
        })
    }
    // If anything goes wrong, an error is sent to the user
    catch (err) {
        res.status(500).json({ error: err.message });
    }
})

app.post('/api/exercises/:exercise_id/sets', async(req,res) => {

    try {
        // Uses a specific exercise ID
        const {exercise_id} = req.params;

        // Grab data from user
        const {set_number, reps, weight} = req.body;

        // Insert into specific exercises database
        const newSet = await pool.query(
            'INSERT INTO exercise_sets (exercise_id, set_number, reps, weight) VALUES ($1, $2, $3, $4) RETURNING *',
            [exercise_id, set_number, reps, weight]
        )

        // Success message for adding a set
        res.json({
            message: 'Set added successfully!',
            set: newSet.rows[0]
        })
    }
    // If anything goes wrong, an error is sent to the user
    catch (err) {
        res.status(500).json({ error: err.message });
    }

})

app.get('/api/workouts', async (req,res) => {
    try {

        // Currently hardcoded to a single user
        const user_id = 1

        // Grab data from the database about workouts
        const workouts = await pool.query(
            'SELECT id, workout_name, date, description, created_at FROM workouts WHERE user_id = $1 ORDER BY date DESC',
            [user_id]
          );
        
        res.json({
            message: 'Workout History Grabbed from database',
            workouts: workouts.rows
        });
    }
    // If anything goes wrong, an error is sent to the user
    catch (err) {
        res.status(500).json({ error: err.message });
    }
})

app.get('/api/workouts/:id', async (req, res) => {
    try {
        const {id} = req.params;

        // Find the specific workout from the database
        const workout = await pool.query(
            'SELECT * FROM workouts WHERE id = $1',
            [id]
          );
        
        // If there are no workouts, send an error message
        if (workout.rows.length === 0) {
            return res.status(404).json({ error: 'Workout not found' });
        }

        // Grabs each exercise and each of their sets from the database
        const exercisesWithSets = await pool.query(`
            SELECT 
              e.id as exercise_id,
              e.exercise_name,
              e.description as exercise_description,
              s.id as set_id,
              s.set_number,
              s.reps,
              s.weight
            FROM exercises e
            LEFT JOIN exercise_sets s ON e.id = s.exercise_id
            WHERE e.workout_id = $1
            ORDER BY e.id, s.set_number
          `, [id]);

        res.json({
            workout: workout.rows[0],
            exercises: exercisesWithSets.rows
        });

    } 
    // If anything goes wrong, an error is sent to the user
    catch (err) {
        res.status(500).json({ error: err.message });
    }
})
