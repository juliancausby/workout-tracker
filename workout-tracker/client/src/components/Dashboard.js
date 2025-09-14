import React, { useState } from 'react';
import axios from 'axios';

function Dashboard({ user, setUser }) {
  const [page, nextPage] = useState('home');

  // required useStates
  const [workoutName, setWorkoutName] = useState('Workout Name');
  const [workoutDate, setWorkoutDate] = useState('');
  const [workoutDesc, setWorkoutDesc] = useState('');
  const [exercises, setExercises] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [workoutDetails, setWorkoutDetails] = useState(null);

  // Function used to add an exercise
  const addExercise = () => {
    const newExercise = {
      id: Date.now(),
      name: '', // This creates the name property
      sets: [{ weight: '', reps: '' }],
    };
    setExercises([...exercises, newExercise]);
  };

  // Function to add a set to an exercise
  const addSet = (exerciseIndex) => {
    const updatedExercises = exercises.map((ex, i) =>
      i === exerciseIndex
        ? {
            ...ex,
            sets: [...ex.sets, { weight: '', reps: '' }],
          }
        : ex
    );
    setExercises(updatedExercises);
  };

  // Use the react effect for loadWorkouts()
  React.useEffect(() => {
    if (page === 'history') {
      loadWorkouts();
    }
  }, [page]);

  // Load workouts
  const loadWorkouts = async () => {
    // Loading status is true
    setLoading(true);
    try {
      // Get the workouts and set the workouts variable
      const response = await axios.get('http://localhost:5000/api/workouts');
      setWorkouts(response.data.workouts);
    }

    // Incase of any errors send it to the console!
    catch (error) {
      console.error('Error loading workouts:', error);
    }

    // Set the loading state back to false after loading workouts whether its successful or not
    finally {
      setLoading(false);
    }
  };

  // Load details on a specific workout
  const loadWorkoutDetails = async (workoutId) => {
    try {
      // Grab the data on each workout and set the variables
      const response = await axios.get(`http://localhost:5000/api/workouts/${workoutId}`);
      setWorkoutDetails(response.data);
      setSelectedWorkout(workoutId);
    }

    // Incase of any errors send it to the console!
    catch (error) {
      console.error('Error loading workout details:', error);
    }
  };

  // Different pages for each button
  if (page === 'add-workout') {
    return (
      <div className="App">
        <header className="App-header">
          <input
            type="text"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            style={{
              fontSize: '24px',
              textAlign: 'center',
              background: 'transparent',
              border: '1px solid white',
              color: 'white',
              padding: '10px',
              marginBottom: '50px',
            }}
          />

          <div>
            <button
              onClick={addExercise}
              style={{ padding: '10px 20px', marginBottom: '20px' }}
            >
              Add Exercise?
            </button>
          </div>

          {exercises.map((exercise, index) => (
            <div
              key={exercise.id}
              style={{
                border: '1px solid white',
                margin: '10px',
                padding: '15px',
                borderRadius: '5px',
              }}
            >
              <div>
                <input
                  type="text"
                  placeholder="(Exercise Name)"
                  value={exercise.name}
                  onChange={(e) => {
                    const updatedExercises = exercises.map((ex, i) =>
                      i === index ? { ...ex, name: e.target.value } : ex
                    );
                    setExercises(updatedExercises);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    fontSize: '18px',
                    marginBottom: '10px',
                    width: '100%',
                    position: 'relative',
                  }}
                />
              </div>

              {exercise.sets.map((set, setIndex) => (
                <div
                  key={setIndex}
                  style={{ marginTop: '10px', display: 'flex', gap: '10px' }}
                >
                  <div>
                    <label>Weight: </label>
                    <input
                      type="number"
                      value={set.weight || ''}
                      placeholder="0"
                      onChange={(e) => {
                        const updatedExercises = exercises.map((ex, i) =>
                          i === index
                            ? {
                                ...ex,
                                sets: ex.sets.map((s, sIndex) =>
                                  sIndex === setIndex ? { ...s, weight: e.target.value } : s
                                ),
                              }
                            : ex
                        );
                        setExercises(updatedExercises);
                      }}
                      style={{ width: '60px', padding: '5px' }}
                    />
                    <span>kg</span>
                  </div>

                  <div>
                    <label>Reps: </label>
                    <input
                      type="number"
                      value={set.reps || ''}
                      placeholder="0"
                      onChange={(e) => {
                        const updatedExercises = exercises.map((ex, i) =>
                          i === index
                            ? {
                                ...ex,
                                sets: ex.sets.map((s, sIndex) =>
                                  sIndex === setIndex ? { ...s, reps: e.target.value } : s
                                ),
                              }
                            : ex
                        );
                        setExercises(updatedExercises);
                      }}
                      style={{ width: '60px', padding: '5px' }}
                    />
                  </div>

                  <button
                    // Button used to delete an exericse
                    onClick={() => {
                      const updatedExercises = exercises.map((ex, i) =>
                        i === index
                          ? {
                              ...ex,
                              sets: ex.sets.filter((_, sIndex) => sIndex !== setIndex),
                            }
                          : ex
                      );
                      setExercises(updatedExercises);
                    }}
                    style={{
                      marginLeft: '10px',
                      padding: '2px 6px',
                      backgroundColor: 'black',
                      color: 'red',
                      border: 'none',
                      borderRadius: '3px',
                    }}
                  >
                    X
                  </button>
                </div>
              ))}

              <button
                onClick={() => addSet(index)}
                style={{
                  marginTop: '10px',
                  padding: '5px 10px',
                  backgroundColor: 'transparent',
                  border: '1px solid white',
                  color: 'white',
                }}
              >
                Add Set?
              </button>

              <button
                onClick={() => {
                  const updatedExercises = exercises.filter((_, i) => i !== index);
                  setExercises(updatedExercises);
                }}
                style={{
                  marginTop: '10px',
                  padding: '5px 10px',
                  backgroundColor: 'red',
                  border: '1px solid white',
                  color: 'white',
                }}
              >
                Remove Exercise
              </button>
            </div>
          ))}

          <button
            onClick={async () => {
              // Incase a user presses finish workout without adding anything, send an alert
              if (exercises.length === 0) {
                alert('Please add atleast one exercise before finishing your workout');
                return;
              }

              try {
                // Create the workout and add it to the database
                const workoutResponse = await axios.post('http://localhost:5000/api/workouts', {
                  workout_name: workoutName,
                  date: new Date().toISOString().split('T')[0], // Today's date
                  description: workoutDesc,
                });

                const workoutId = workoutResponse.data.workout.id;

                // Create a nested for loop to add to the database each exercise and set of those exercises
                for (let i = 0; i < exercises.length; i++) {
                  const exercise = exercises[i];

                  // Skip any exercises that dont have a name
                  if (exercise.name.trim() === '') continue;

                  // Post it to the database
                  const exerciseResponse = await axios.post(
                    `http://localhost:5000/api/workouts/${workoutId}/exercises`,
                    {
                      exercise_name: exercise.name,
                      description: '',
                    }
                  );

                  const exerciseId = exerciseResponse.data.exercise.id;

                  for (let j = 0; j < (exercise.sets || []).length; j++) {
                    const set = exercise.sets[j];

                    // Skip any sets that dont have reps or a weight
                    if (!set || (set.reps === '' && set.weight === '')) continue;

                    // Post it to the database
                    await axios.post(`http://localhost:5000/api/exercises/${exerciseId}/sets`, {
                      set_number: j + 1,
                      reps: parseInt(set.reps) || 0,
                      weight: parseFloat(set.weight) || 0,
                    });
                  }
                }

                alert('Workout saved successfully to database!');
                nextPage('home');
              } catch (err) {
                console.error('Error saving workout:', err);
                alert('Workout unable to be saved!');
              }
            }}
            style={{
              padding: '15px 50px',
              fontSize: '18px',
              backgroundColor: 'green',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              marginBottom: '20px',
              marginRight: '20px',
            }}
          >
            Finish Workout
          </button>

          <button onClick={() => nextPage('home')}>Back to Dashboard</button>
        </header>
      </div>
    );
  }

  if (page === 'history') {
    if (selectedWorkout && workoutDetails) {
      // Group exercises by ID
      const exerciseGroups = {};
      workoutDetails.exercises.forEach((row) => {
        const exerciseId = row.exercise_id;
        if (!exerciseGroups[exerciseId]) {
          exerciseGroups[exerciseId] = {
            name: row.exercise_name,
            sets: [],
          };
        }
        if (row.set_id) {
          exerciseGroups[exerciseId].sets.push({
            set_number: row.set_number,
            reps: row.reps,
            weight: row.weight,
          });
        }
      });

      return (
        <div className="App">
          <header className="App-header">
            <h2>{workoutDetails.workout.workout_name}</h2>
            <p>Date: {workoutDetails.workout.date}</p>

            {Object.values(exerciseGroups).map((exercise, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid white',
                  margin: '10px',
                  padding: '15px',
                  borderRadius: '5px',
                }}
              >
                <h3>{exercise.name}</h3>
                {exercise.sets.map((set, setIndex) => (
                  <div key={setIndex} style={{ marginBottom: '5px' }}>
                    Set {set.set_number}: {set.reps} reps @ {set.weight}kg
                  </div>
                ))}
              </div>
            ))}

            <button
              onClick={() => {
                setSelectedWorkout(null);
                setWorkoutDetails(null);
              }}
            >
              Back to History
            </button>
          </header>
        </div>
      );
    }

    return (
      <div className="App">
        <header className="App-header">
          <h2>Workout History</h2>
          {loading ? (
            <p>Loading workouts...</p>
          ) : (
            <div>
              {workouts.map((workout) => (
                <div
                  key={workout.id}
                  onClick={() => loadWorkoutDetails(workout.id)}
                  style={{
                    border: '1px solid white',
                    margin: '10px',
                    padding: '15px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  <h3>{workout.workout_name}</h3>
                  <p>{workout.date}</p>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => nextPage('home')}>Back to Dashboard</button>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome, {user?.user_name}!</h1>
        <button onClick={() => setUser(null)}>Logout</button>
        <div>
          <h2>What would you like to do?</h2>
          <button onClick={() => nextPage('add-workout')}>Add New Workout</button>
          <button onClick={() => nextPage('templates')}>Template Workouts (Coming Soon!)</button>
          <button onClick={() => nextPage('history')}>View Workout History</button>
        </div>
      </header>

      <main className="App"></main>
    </div>
  );
}

export default Dashboard;
