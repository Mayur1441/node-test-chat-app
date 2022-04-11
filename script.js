require("dotenv").config();
var socket = io();

$(() => {
    $("#send").click(() => {
        if ($('#name').val().toString().length > 0 && $('#message').val().toString().length > 0) {
            sendMessage({name: $("#name").val(), group: $("#group").val(), message: $("#message").val()});
        }
    });
    getMessages()
});

socket.on('message', getMessages);

function addMessages(message) {
    console.log('message', message);
    $("#" + message.group).append(`<p><b> ${message.name} :-</b> ${message.message} </p>`);
}

function getMessages() {
    $("#messages").empty();
    $.get(process.env.API_LINK + '/groups', (groupsData) => {
        console.log('', $('#group > option').length)
        if ($('#group > option').length <= 1) {
            groupsData.forEach(function (singleGroup) {

                $('#group').append($('<option>', {value: singleGroup.name, text: singleGroup.name}));

            });
        }
        var groupName = $('#group').find(":selected").val();
        if (groupName.toString().length > 0) {
            $.get(process.env.API_LINK + '/messagesGroup/' + groupName, (singleGroupMsgData) => {
                if (singleGroupMsgData.length > 0) {
                    $("#messages").empty();
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
    $.post(process.env.API_LINK + '/messages', message);
    setMessages();
}

function setMessages() {
    var groupName = $('#name').val().toString().trim().toUpperCase();
    var userName = $('#group').find(":selected").val();
    if (groupName.length && userName) {
        $.get(process.env.API_LINK + '/messagesGroup/' + groupName, (singleGroupMsgData) => {
            $("#messages").empty();
            if (singleGroupMsgData.length > 0) {
                $("#messages").append(`<div id="${groupName}"><u><h2>${groupName}</h2></u><br>`);
                singleGroupMsgData.forEach(addMessages);
                $("#messages").append(`</div>`);
            } else {
                console.log('singleGroupMsgData', singleGroupMsgData.length)
                $("#messages").append(`<div id="${groupName}"><u><h2>${groupName}</h2></u><br>`);
                $("#messages").append(`<h4>No msg here</h4></></div>`);
            }
        })
    }
}