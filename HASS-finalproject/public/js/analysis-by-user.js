const socket = io();

document.getElementById('analysis_by_user_form').addEventListener('submit', (event) => {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    // Emit the inputData to the server
    socket.emit('analysis_by_user', username);
});

socket.on('process_analysis_by_user_data', () => {
    console.log("Server socket emit 'process_analysis_by_user_data' received");
    barplot_update('retweet_count');
    connected_scatterplot_update();
    map_plot_update();
});

// let radioButtons = document.querySelectorAll('input[type="radio"]');
let radioButtons = document.getElementsByName('engagement_count');

radioButtons.forEach(function(radioButton) {
    radioButton.addEventListener('change', function(event) {
        // Your event handling code here
        // console.log("Radio button selected: " + event.target.value);
        if(event.target.value == 'retweet_count') {
            barplot_update('retweet_count');
        }
        if(event.target.value == 'reply_count') {
            barplot_update('reply_count');
        }
        if(event.target.value == 'like_count') {
            barplot_update('like_count');
        }
        if(event.target.value == 'quote_count') {
            barplot_update('quote_count');
        }
        if(event.target.value == 'bookmark_count') {
            barplot_update('bookmark_count');
        }
    });
});