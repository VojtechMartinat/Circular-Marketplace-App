const { Task } = require('../models/initialise');

const task1 = {
    taskID: 1,
    description: "Login task - Tracks the time taken by the user to log into the application."
};

const task2 = {
    taskID: 2,
    description: "Create article task - Measures the time taken by the user to create and publish a new article."
};

const task3 = {
    taskID: 3,
    description: "Buy task - Records the duration of the process where a user completes a purchase on the platform."
};

const task4 = {
    taskID: 4,
    description: "Search task - How long it takes to search the article that a user wants"
}
const generate = () =>{
    // Create tasks in the database
    Task.create(task1)
        .then(() => console.log('Task 1 created successfully'))
        .catch(err => console.error('Error creating Task 1:', err));

    Task.create(task2)
        .then(() => console.log('Task 2 created successfully'))
        .catch(err => console.error('Error creating Task 2:', err));

    Task.create(task3)
        .then(() => console.log('Task 3 created successfully'))
        .catch(err => console.error('Error creating Task 3:', err));

    Task.create(task4)
        .then(() => console.log('Task 4 created successfully'))
        .catch(err => console.error('Error creating Task 4:', err));
}
module.exports = {generate}
