var DATA_COUNT = 6;

//hide sections at start
$('#chart').hide();
$('#private-chat').hide();
$('#dropdown-menu').hide();

//On form click
function showForm() {
    $('#public-form').show();
    $('#form-tab').addClass('is-active');
    $('#chart').hide();
    $('#private-chat').hide();
    $('#chart-tab').removeClass('is-active');
    $('#private-chat-tab').removeClass('is-active');
}

//On chart click
function showChart() {
    $('#chart').show();
    $('#chart-tab').addClass('is-active');
    $('#public-form').hide();
    $('#private-chat').hide();
    $('#form-tab').removeClass('is-active');
    $('#private-chat-tab').removeClass('is-active');
}

//On private chat click
function showPrivateChat() {
    $('#private-chat').show();
    $('#private-chat-tab').addClass('is-active');
    $('#public-form').hide();
    $('#chart').hide();
    $('#form-tab').removeClass('is-active');
    $('#chart-tab').removeClass('is-active');
}

// Toggle dropdown list
function dropdownClick() {
    $('#dropdown-menu').toggle();
}

//Choose private recipien
function chooseUser(username){
    $('#dropdown-menu').hide();
    $('#dropdown-display-text').text($(username).find('p').first().text());
    let userSocket = $(username).attr('dropdown-socket-id');
    let userChatBox = $(`.box[chat-box-socket-id="${userSocket}"`);
    $('#chat-boxes').children().hide();
    if (!userChatBox.length){
        userChatBox = $('#chat-box').clone();
        userChatBox.removeAttr('id');
        userChatBox.attr('chat-box-socket-id', userSocket).appendTo('#chat-boxes');
    }
    userChatBox.show();
}

// Create data set
var data = {
    labels: ['user1'],
    datasets: [{
        data: [0]
    }]
};

// Create table options
var options = {
    legend: false,
    tooltips: false,
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    },
    elements: {
        rectangle: {
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }
    }
};

// Builds table
var chart = new Chart('chart-0', {
    type: 'bar',
    data: data,
    options: options
});

// Add random data to table
function addDataset() {
    chart.data.datasets.push({
        data: [Math.random()*10+1,Math.random()*10+1,Math.random()*10+1,Math.random()*10+1,Math.random()*10+1,Math.random()*10+1]
    });
    chart.update();
}

// eslint-disable-next-line no-unused-vars

// Delete data from table 
function removeDataset() {
    chart.data.datasets.shift();
    chart.update();
}

// Randomize value of first data
function randomize() {
    chart.data.datasets[0] = {"data":[Math.random() * 10 + 1]};
    chart.update();
}