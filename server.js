let express = require('express');
let bodyParser = require('body-parser')
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
io.on('connection', () => {
    console.log('a user is connected')
})
let mongoose = require('mongoose');
let dbUrl = 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false'
mongoose.connect(dbUrl, {}, (err) => {
    console.log('mongodb connected', err);
})
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

/* Models*/
var Message = mongoose.model('Message', {
    name: String,
    group: String,
    message: String
})
var Group = mongoose.model('Group', {
    name: String
})

// Save group
const GroupName = [{"name": "IT"}, {"name": "HR"}, {"name": "Sales"}];
GroupName.forEach(function (singleGroup) {
    Group.findOne(singleGroup, function (err, docs) {
        if (err) {
            console.log(err)
        } else {
            if (!docs) {
                console.log('No groups')
                let grp = new Group(singleGroup);
                grp.save();
            }
        }
    });
});

app.get('/groups', (req, res) => {
    Group.find({}, (err, groups) => {
        res.send(groups);
    })
});

app.get('/messagesGroup/:group', (req, res) => {
    let group = req.params.group
    Message.find({group: group}, (err, messages) => {
        res.send(messages);
    })
});

app.post('/messages', async (req, res) => {
    try {
        let message = new Message(req.body);
        message.name = message.name.toUpperCase();
        console.log('msg', message);

        if(message.group == '') {
            message.group = message.name;
        }

        await message.save()

        let censored = await Message.findOne({message: 'badword'});
        if (censored)
            await Message.deleteOne({_id: censored.id})
        else
            io.emit('message', req.body);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
        return console.log('error', error);
    } finally {
        console.log('Message Posted')
    }
});

let server = http.listen(3000, () => {
    console.log('server is running on port', server.address().port);
});