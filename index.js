var express = require('express')
var app = express()

app.listen(1337)

app.use('/', express.static('public'));

app.set("view engine", "ejs");
app.set("views", "views");

app.get("/submit", result);

function result(req, res) {
    var roll = req.query.rollnumber;
    var semester = req.query.sem;
    var mdb = require("mongodb").MongoClient;
    var con = new mdb("mongodb+srv://USERNAME:PASSWORD@cluster0.q4mnv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster"); //mongodb connection string
    con.db("results_portal").collection("results").findOne({_id: roll, [semester]: { $exists: true }}).then(
        result => {
            if (result) {
                // Render view if result is found
                res.render("view", { data: result, sem: result[semester], semester});
            } else {
                // Handle case where no result is found
                res.redirect("/?status=-1");
            }
        });
}
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.setHeader('WWW-Authenticate', 'Basic');
        return res.status(401).send('Authentication required');
    }

    const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const [username, password] = credentials;

    if (username === 'admin' && password === 'admin') {
        next(); // Proceed to the next middleware/route handler
    } else {
        res.setHeader('WWW-Authenticate', 'Basic');
        return res.status(401).send('Invalid username or password');
    }
}
app.get('/admin', authenticate, (req, res) => {
    res.render('admin'); // Ensure you create `admin.ejs` for the data entry form
});
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/admin/submit', authenticate, (req, res) => {
    const { rollnumber, name, branch, semester, results } = req.body;
    const mdb = require("mongodb").MongoClient;
    const con = new mdb("mongodb+srv://USERNAME:PASWORD@cluster0.q4mnv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true }); //mongodb connection string

    con.connect().then(client => {
        const db = client.db("results_portal");
        const parsedResults = JSON.parse(results); // Parse results from form input
        db.collection("results").updateOne(
            { _id: rollnumber }, // Use roll number as unique ID
            { $set: { name, branch, [semester]: parsedResults } }, // Update or insert results
            { upsert: true } // Insert if document does not exist
        ).then(() => {
            res.send('Data saved successfully!');
            client.close(); // Close the database connection
        }).catch(err => {
            console.error('Database operation failed:', err);
            res.status(500).send('Failed to save data.');
            client.close();
        });
    }).catch(err => {
        console.error('Database connection failed:', err);
        res.status(500).send('Failed to connect to the database.');
    });
});
app.post("/insert", (req, res) => {
    const { username, password, rollnumber, name, branch, semester, subjects } = req.body;


    const mdb = require("mongodb").MongoClient;
    const con = new mdb("mongodb+srv://USERNAME:PASSWORD@cluster0.q4mnv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster"); //mongodb connection string

    const studentData = {
        _id: rollnumber,
        name,    // Ensure this is properly extracted
        branch,  // Ensure this is properly extracted
        [semester]: subjects
    };

    con.db("results_portal")
        .collection("results")
        .updateOne(
            { _id: rollnumber },
            { $set: studentData },
            { upsert: true }
        )
        .then(() => res.send("Data inserted successfully"))
        .catch((err) => res.status(500).send("Error inserting data: " + err.message));
});
