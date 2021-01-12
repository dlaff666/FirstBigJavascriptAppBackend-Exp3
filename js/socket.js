$(function () {

    //create socket
    var socket = io();

    //hide chart section at start
    $('#chart').hide();

    //on a submit
    $('form').submit((e) => {
        //prevent reloading
        e.preventDefault();

        //get form values
        let userFullName = $('#form-user-full-name').val();
        let userShortName = $('#form-user-short-name').val();
        let userMessage = $('#form-user-message').val();
        let userFavoriteNumber = $('#form-user-favorite-number').val();
        let userFavoriteColor = $('#form-user-favorite-color').val();

        //update user card ~~OBSOLETE~~
        /*const user-card = $(`.box[data-socket-id="${socket.id}"`);
        user-card.find('strong').text(userFullName);
        user-card.find('small').text(userShortName);
        user-card.find('em').text(userFavoriteNumber);
        user-card.find('span').text(userMessage);
        $('#card-user-full-name-1').text(userFullName);
        $('#card-user-short-name-1').text(userShortName);
        $('#card-user-message-1').text(userMessage);
        $('#card-user-favorite-number-1').text(userFavoriteNumber);
        $('#card-user-favorite-color-1').css('background-color', userFavoriteColor);*/

        //form the JSON data
        let jsonData = {
            "socketId": socket.id,
            "userFullName": userFullName,
            "userShortName": userShortName,
            "userMessage": userMessage,
            "userFavoriteNumber": userFavoriteNumber,
            "userFavoriteColor": userFavoriteColor
        }

        //emit jsonData to all
        socket.emit('user-update', jsonData);

        //unknown purpose
        /*return false;*/

    });

    //on recieveing a message
    socket.on('chat message', function(msg){
        $('#messages').append($('<li>').text(msg));
    });

    //on recieving a user update
    socket.on('user-update', function(jsonData) {

        // Update user card ~~OBSOLETE~~
        /*$('#card-user-full-name-1').text(jsonData.userFullName);
        $('#card-user-short-name-1').text(jsonData.userShortName);
        $('#card-user-message-1').text(jsonData.userMessage);
        $('#card-user-favorite-number-1').text(jsonData.userFavoriteNumber);
        $('#card-user-favorite-color-1').css('background-color', jsonData.userFavoriteColor);*/

        //set user card
        let userCard = $(`.box[data-socket-id="${jsonData.socketId}"]`);
        
        //create box if one doesn't exist
        if (!userCard.length) {
            console.log('Making a box');
            userCard = $('.box').first().clone();
            userCard.attr('data-socket-id', jsonData.socketId).appendTo('#user-list');
        }

        //update user card
        userCard.find('strong').text(jsonData.userFullName);
        userCard.find('small').text(jsonData.userShortName);
        userCard.find('em').text(jsonData.userFavoriteNumber);
        userCard.find('span').text(jsonData.userMessage);
        userCard.find('figure').css('background-color', jsonData.userFavoriteColor);
        
        //update chart
        chart.data.datasets.push({
            data: [jsonData.userFavoriteNumber],
            backgroundColor: [jsonData.userFavoriteColor]
        });
        chart.update();

    });

    //on user typing
    socket.on('user-typing', function(jsonData){      
        //display socket id above messages
        $('#user-typing-status').text(jsonData.socketId);

        //update user card
        let userCard = $(`.box[data-socket-id="${jsonData.socketId}"]`);
        if (userCard) {
            userCard.find('div.icon').removeClass('is-hidden');
            setTimeout(function() {
            userCard.find('div.icon').addClass('is-hidden');
            }, 3000);
        }
    });

    //count connected users
    socket.on('connect-count', function(count){
        //update Count of Connection on the Site
        console.log(count);
        $('#people-connected').text(count);
    });

    //on new user connection
    socket.on('connect-user', function(jsonData){

        //update number of user-list boxes      
        if (jsonData.socketId !== socket.id) 
        {
            let newCard = $('.box').first().clone();
            newCard.attr('data-socket-id', jsonData.socketId).appendTo('#user-list');
        }

        //Set self card
        let myCard = $(`.box[data-socket-id="${socket.id}"]`);

        //Get self data
        let myFullName = myCard.find('strong').text();
        let myShortName = myCard.find('small').text();
        let myFavoriteNumber = myCard.find('em').text();
        let myMessage = myCard.find('span').text();
        let myFavoriteColor = myCard.find('figure').css('background-color');

        //Form my JSON data
        let myJsonData = {
            "socketId": socket.id,
            "userFullName": myFullName,
            "userShortName": myShortName,
            "userMessage": myMessage,
            "userFavoriteNumber": myFavoriteNumber,
            "userFavoriteColor": myFavoriteColor,
            "targetID": jsonData.socketId
        }

        //Emit data to new user
        socket.emit('private-user-update', myJsonData)
    });

    //on user disconnect
    socket.on('disconnect-user', function(jsonData){

        //delete user card
        let userCard = $(`.box[data-socket-id="${jsonData.socketId}"]`);
        userCard.slideUp('slow').remove();
    });

    //on connect
    socket.on("connect", () => {
        /*$('.box').first().data('socket-id', socket.id);*/
        $('.box').first().attr('data-socket-id', socket.id);
    });

    const fullNameFromLocalStorage = window['localStorage'].getItem('fullName');

    //key-up listener for full-name field in form
    $("#form-user-full-name").keyup(() => {
        socket.emit('user-typing', { "socketId": socket.id });
    });

});