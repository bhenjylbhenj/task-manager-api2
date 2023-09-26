require('../src/db/mongoose');
const Task = require('../src/model/task');

// Task.findByIdAndDelete('64f8315c2b088d5f28acd166').then((taskRemoved) => {
//     console.log(taskRemoved);
//     return Task.countDocuments({completed: false})
// }).then((notCompletedTasks) => {
//     console.log(notCompletedTasks);
// }).catch(e => console.log(e));



// Goal: Use async/await

// 1. Create deleteTaskAndCoun as an async function
// 	-Accept id of task to remove
// 2. Use await to delete task an count up incomplete tasks
// 3. Return the count
// 4. Call the function and attach then/catch to log results 
// 5. Test your work!


//  ----- Challenge -----Challenge -----Challenge -----Challenge -----Challenge -----
const deleteTaskAndCount = async (id) => {
    await Task.findByIdAndDelete(id);
    return Task.countDocuments({completed: false});
}

deleteTaskAndCount('64f82b527a8bd9fae79cc231').then((count) => {
    console.log(count)
}).catch(e => console.log(e));
//  ----- Challenge -----Challenge -----Challenge -----Challenge -----Challenge -----