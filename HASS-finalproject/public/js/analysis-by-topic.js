const socket = io();

document.getElementById('analysis_by_topic_form').addEventListener('submit', (event) => {
    event.preventDefault();
    
    const keywords = document.getElementById('keywords').value;
    // Emit the inputData to the server
    socket.emit('analysis_by_topic', keywords);
});

socket.on('process_analysis_by_topic_data', () => {
    console.log("Server socket emit 'process_analysis_by_topic_data' received");
    scatterplot_update();
    wordcloud_update();
    donut_chart_update();
});