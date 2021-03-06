$(function () {

    //create socket
    var socket = io();

    //Set fields from local
    for (var i=0; i<window['localStorage'].length; i++)
    {
        let key = window['localStorage'].key(i);
        switch (key)
        {
            case 'fullName':
                $('#form-user-full-name').val(window['localStorage'].getItem(key));
                break;
            case 'shortName':
                $('#form-user-short-name').val(window['localStorage'].getItem(key));
                break;
            case 'favNumber':
                $('#form-user-favorite-number').val(window['localStorage'].getItem(key));
                break;
            case 'favColor':
                $('#form-user-favorite-color').val(window['localStorage'].getItem(key));
                break;
            default:
                console.log('Unknown storage variable: ' + key);
        }
    }

    //on a submit
    $('#public-form').submit((e) => {
        //prevent reloading
        e.preventDefault();

        //get form values
        let userFullName = $('#form-user-full-name').val();
        let userShortName = $('#form-user-short-name').val();
        let userMessage = $('#form-user-message').val();
        let userFavoriteNumber = $('#form-user-favorite-number').val();
        let userFavoriteColor = $('#form-user-favorite-color').val();

        //Store fields in local
        window['localStorage'].setItem('fullName', userFullName);
        window['localStorage'].setItem('shortName', userShortName);
        window['localStorage'].setItem('favNumber', userFavoriteNumber);
        window['localStorage'].setItem('favColor', userFavoriteColor);

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

        //prevent reload
        return false;

    });

    $('#private-form').submit((e) => {
        //prevent reloading
        e.preventDefault();

        let chatBox = $('div[chat-box-socket-id]:visible').first();

        //get form values
        let userMessage = $('#form-user-private-chat').val();
        let userFullName = $('#self-box').find('h2').text();
        let targetSocket = chatBox.attr('chat-box-socket-id');

        //form the JSON data
        let jsonData = {
            "socketId": socket.id,
            "userMessage": userMessage,
            "userFullName": userFullName,
            "targetSocket": targetSocket
        }

        //emit jsonData to target
        socket.emit('user-private-chat', jsonData);

        //add to chat window
        let newMessage = $('#chat-message').clone();
        newMessage.removeAttr('id');
        newMessage.text(userFullName + ': ' + userMessage);
        newMessage.appendTo(chatBox);
        
        //prevent reload
        return false;

    });

    //on recieveing a message
    socket.on('private-message', function(jsonData){
        console.log('message recieved')
        //get private chat box
        let chatBox = $(`div[chat-box-socket-id="${jsonData.socketId}"]`);

        //create chat box
        if (!chatBox.length){
            chatBox = $('#chat-box').clone();
            chatBox.removeAttr('id');
            chatBox.attr('chat-box-socket-id', jsonData.socketId).appendTo('#chat-boxes');
        }

        //add to chat window
        let newMessage = $('#chat-message').clone();
        newMessage.removeAttr('id');
        newMessage.text(jsonData.userFullName + ': ' + jsonData.userMessage);
        newMessage.appendTo(chatBox);
        
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
            userCard = $('#user-box-template').clone();
            userCard.removeAttr('id');
            userCard.attr('data-socket-id', jsonData.socketId).appendTo('#user-list');
        }

        //update user card
        userCard.find('h2').text(jsonData.userFullName);
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

        //set user item
        let userDropdownItem = $(`div[dropdown-socket-id="${jsonData.socketId}"]`);

        //create user item
        if (!userDropdownItem.length && jsonData.socketId != socket.id) {
            userDropdownItem = $('#dropdown-template').clone();
            userDropdownItem.removeAttr('id');
            userDropdownItem.attr('dropdown-socket-id', jsonData.socketId).appendTo('#dropdown-items')
        }

        //update user item
        if (jsonData.userFullName != '') {
            userDropdownItem.find('.dropdown-username').text(jsonData.userFullName);
        }
        else{
            userDropdownItem.find('.dropdown-username').text('[empty name]');
        }

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
            let newCard = $('#user-box-template').clone();
            newCard.removeAttr('id');
            newCard.attr('data-socket-id', jsonData.socketId).appendTo('#user-list');
        }

        //Set self card
        let myCard = $(`.box[data-socket-id="${socket.id}"]`);

        //Get self data
        let myFullName = myCard.find('h2').text();
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

        //set user item
        let userDropdownItem = $(`div[dropdown-socket-id="${jsonData.socketId}"]`);

        //create user item
        if (!userDropdownItem.length && jsonData.socketId != socket.id) {
            userDropdownItem = $('#dropdown-template').clone();
            userDropdownItem.removeAttr('id');
            userDropdownItem.find('.dropdown-username').text('New User');
            userDropdownItem.attr('dropdown-socket-id', jsonData.socketId).appendTo('#dropdown-items');
        }

    });

    //on user disconnect
    socket.on('disconnect-user', function(jsonData){

        //delete user card
        let userCard = $(`.box[data-socket-id="${jsonData.socketId}"]`);
        userCard.slideUp('slow').remove();

        //delete user dropdown
        let userDropdownItem = $(`div[dropdown-socket-id="${jsonData.socketId}"]`);
        userDropdownItem.remove();
    });

    //on connect
    socket.on("connect", () => {
        /*$('.box').first().data('socket-id', socket.id);*/
        $('#self-box').attr('data-socket-id', socket.id);
    });

    //key-up listener for full-name field in form
    $("#form-user-full-name").keyup(() => {
        socket.emit('user-typing', { "socketId": socket.id });
    });

});