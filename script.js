var socket = io();
$(() => {
    $("#send").click(() => {
        if ($('#group').find(":selected").val().toString().length > 0 && $('#name').val().toString().length > 0 && $('#message').val().toString().length > 0) {
            sendMessage({name: $("#name").val(), group: $("#group").val(), message: $("#message").val()});
        }
    });
    getMessages()
});

socket.on('message', getMessages);

function addMessages(message) {
    console.log('message', message);
    $("#" + message.group).append(`<p> ${message.name} == ${message.message} </p>`);
}

function getMessages() {
    $("#messages").empty();
    $.get('http://localhost:3000/groups', (groupsData) => {
        groupsData.forEach(function (singleGroup) {
            if ($('#group > option').length < 4) {
                $('#group').append($('<option>', {value: singleGroup.name, text: singleGroup.name}));
            }
        });
        var groupName = $('#group').find(":selected").val();
        if (groupName.toString().length > 0) {
            $.get('http://localhost:3000/messagesGroup/' + groupName, (singleGroupMsgData) => {
                if (singleGroupMsgData.length > 0) {
                    $("#messages").append(`<div id="${groupName}"><u><h2>${groupName} Group</h2></u><br>`);
                    singleGroupMsgData.forEach(addMessages);
                    $("#messages").append(`</div>`);
                } else {
                    console.log('singleGroupMsgData', singleGroupMsgData.length)
                    $("#messages").append(`<div id="${groupName}"><u><h2>${groupName} Group</h2></u><br>`);
                    $("#messages").append(`<h4>No msg here</h4></></div>`);
                }
            })
        }
    })
}

function sendMessage(message) {
    // console.log('message', message);
    $.post('http://localhost:3000/messages', message)
}