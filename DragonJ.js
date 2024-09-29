let count = 0; 
let flag = true;

$(document).ready(function() {
    $('#addTaskBtn').click(function() {
        const taskValue = $('#taskInput').val();
        let durationValue = parseInt($('#durationInput').val(), 10); // Use let for mutability
        count++;

        // Check if the input values are valid
        if (taskValue === '' || isNaN(durationValue) || durationValue <= 0) {
            alert('Please enter both a task and a valid duration.');
            return;
        }

        // Modify durationValue based on count
        if (count % 2 !== 0) { // Odd count
            durationValue *= 2; // Double time for odd counts
            flag = false; // Indicate that health loss will be double
        } else { // Even count
            durationValue /= 2; // Halve time for even counts
            flag = true; // Indicate that health gain will be double
        }

        // Create a new list item for the task
        const listItem = $('<li></li>');

        // Function for displaying the health progress bar number
        function updateHealthDisplay() {
            const progressBar = $('#health');
            const healthValue = $('#healthValue');
            healthValue.text(`${progressBar.val()}/${progressBar.attr('max')}`);
        }

        // Checkbox to mark as complete
        const checkbox = $('<input type="checkbox">').addClass('task-checkbox');
        checkbox.on('click', function() {
            const progressBar = $('#health'); // reference to the progress bar
            let currentValue = parseInt(progressBar.val(), 10);
            
            if (this.checked) {
                listItem.remove();   // remove the list item

                // Increase the progress bar's value (ensure it does not exceed max)
                const newValue = Math.min(currentValue + (flag ? 60 : 30), progressBar.attr('max'));
                progressBar.val(newValue); // Update the progress bar value

                updateHealthDisplay(); // Update health display
            } else {
                listItem.css('text-decoration', 'none'); // Remove the strikethrough if unchecked
            }
        });

        // Create the task content and timer
        const taskContent = $('<span></span>').text(`${taskValue} - `);
        const timerSpan = $('<span></span>').addClass('timer').text(`${durationValue} minutes`);

        // Append checkbox, task content, and timer to the list item
        listItem.append(checkbox).append(taskContent).append(timerSpan);
        $('#taskList').append(listItem);

        // Start the countdown timer
        let remainingTime = durationValue * 60; // Convert minutes to seconds
        const intervalId = setInterval(function() {
            remainingTime--;

            // Update the timer display
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;
            timerSpan.text(`${minutes}m ${seconds < 10 ? '0' + seconds : seconds}s`);

            // If the countdown reaches zero, clear the interval and remove the task
            if (remainingTime <= 0) {
                alert('You have failed to complete your task. As a result, your pet will lose their health.');
                clearInterval(intervalId);
                listItem.remove();

                // Decrease the health progress bar value
                const progressBar = $('#health');
                currentValue = parseInt(progressBar.val(), 10);
                const newValue = Math.max(currentValue - (flag ? 40 : 20), 0); // Health loss based on flag
                progressBar.val(newValue); // Update the progress bar
                updateHealthDisplay(); // Update health display
            }
        }, 1000); //every second

        // make the task field empty
        $('#taskInput').val('');
        $('#durationInput').val('');
    });
});
