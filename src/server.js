const express = require("express");

const app = express();
const port = 1337;

// Tell express to use EJS to render html
app.set("view engine", "ejs");

// needed to let express know how to interpret the data sent in the body (when using POST)
app.use(express.urlencoded({ extended: true }));

// get the cars map from the "DB" file
// Only necessary if we do not declare the variable in this file
const msdb = require("./msdb");
let ms = msdb.msDB;

/*
 * ROUTES
 */

app.get("/", function (req, res) {
    res.render("pages/index", {errors: [], element: {}});
});


app.get("/getAll", function (req, res) {
    res.render("pages/getall", { cars: ms["cars"] });
});

app.post("/save", function (req, res) {
    let msToAdd = createElement(req.body);
    let validation = validate(msToAdd);

    if (validation.success === true) {
        save(msToAdd);
        res.send("Added!");
    } else {
        res.render("pages/index", { errors: validation.errors, element: msToAdd});
    }
});

app.get("/delete", function (req, res) {
    let id = Number(req.query["id"]);
    deleteRecord(id);
    res.send("Deleted!");
});

app.get("/edit", function (req, res) {
    let id = Number(req.query["id"]);
    element = findRecord(id);
    if (element !== 'undefined') {
        res.render("pages/index", { errors: [], element: element, index: id});
    }
    res.send("Car not found!");
});

app.post("/update", function (req, res) {
    let msToAdd = createElement(req.body);
    validation = validate(msToAdd);
    if (validation.success === true && req.body["id"]) {
        const id = Number(req.body["id"]);
        const found = findRecord(id);

        if (typeof found === 'undefined') {
            res.send("Car not found!");
        } else {
            update(id, msToAdd);
            res.send("Updated!");
        }

    } else {
        res.render("pages/index", { errors: validation.errors, element: msToAdd, index: req.body["id"]});
    }

});

/*
 * FUNCTIONS
 */

/**
 * Validates input data
 *
 * @param {Object} input
 * @returns {Object} {success: true|false, errors: []|null}
 */
function validate(input)
{
    let success = true;
    let errors = [];

    if (input.Maker === undefined || input.Maker.length === 0 || input.Maker.length > 20) {
        errors.push('Maker is entered incorrectly');
    }
    if (input.Genmodel === undefined || input.Genmodel.length === 0 || input.Genmodel.length > 20) {
        errors.push('Model is entered incorrectly');
    }
    if (
        input.Adv_year === undefined
        || input.Adv_year.length === 0
        || input.Adv_year < 1900
        || input.Adv_year > new Date().getFullYear()
    ) {
        errors.push('Year is entered incorrectly');
    }
    if (input.Color === undefined || input.Color.length === 0 || input.Color.length > 20) {
        errors.push('Color is entered incorrectly');
    }
    if (input.Runned_Miles === undefined
        || input.Runned_Miles.length === 0
        || input.Runned_Miles < 0
        || input.Runned_Miles > 1000000
    ) {
        errors.push('Mileage is entered incorrectly');
    }
    if (input.Price === undefined || input.Price.length === 0 || input.Price == 0) {
        errors.push('Price is entered incorrectly');
    }
    if (errors.length > 0) {
        success = false;
    }

    return {success: success, errors: errors};
}

/**
 * Transforms input values to an object ready to add to the cars array
 *
 * @param {Object} body
 * @returns {Object}
 */
function createElement(body)
{
    let maker = body["maker"];
    let model = body["model"];
    let year = Number(body["year"]);
    let color = body["color"];
    let mileage = Number(body["mileage"]);
    let price = Number(body["price"]);

    return {
        "Maker": maker,
        "Genmodel": model,
        "Adv_year": year,
        "Color": color,
        "Runned_Miles": mileage,
        "Price": price
    };
}

/**
 * Finds a record in the array of cars
 *
 * @param {int} id
 * @returns {Object|undefined}
 */
function findRecord(id)
{
    return ms["cars"].find(function (e, index) {
        if (index === id) {
            return e;
        }
    });
}

/**
 * Deletes a record from the array of cars
 *
 * @param {int} id
 * @returns {void}
 */
function deleteRecord(id) {
    ms['cars'] = ms['cars'].filter(function (element, index) {
        if (id === index) {
            return false;
        }
        return true;
    });
}

/**
 * Saves a record into the array of cars
 *
 * @param {Object} record
 * @returns {void}
 */
function save(record)
{
    ms["cars"].push(record);
}

/**
 * Updates a record in the array of cars
 *
 * @param {int} id
 * @param {Object} record
 * @returns {void}
 */
function update(id, record) {
    ms["cars"][id] = record;
}

if (process.argv.length >= 3 && process.argv[2] === "start") {
    app.listen(port, function () {
        console.log("Server started!");
    });
} else {
    console.log('Please run "node server.js start" to start the server');
}

module.exports = {
    validate,
    createElement,
    findRecord,
    deleteRecord,
    save,
    update,
    ms
}
