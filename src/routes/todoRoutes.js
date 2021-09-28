const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const Joi = require('joi');
var todoRouter = express.Router();
var Item = require('../modal/todoSchema');
var app = express()



let persons = [{
    id: new Date().getTime(),
    name: "Zohaib",
    email: "zohaib@gmail.com",
    mobile: "0345612154",
    age: "29",
    gender: "male",

},
{
    id: new Date().getTime() + 1,
    name: "Ali",
    email: "ali@gmail.com",
    mobile: "0345612154",
    age: "24",
    gender: "male",

},
{
    id: new Date().getTime() + 2,
    name: "Zaid",
    email: "zaid@gmail.com",
    mobile: "0345612154",
    age: "29",
    gender: "male",

}]





todoRouter.route("/").get((req, res) => {
    res.send("Hellow World")
})


todoRouter.route("/todoArr").get((req, res) => {
    Item.find((err, item) => {
        if (err) {
            console.log(err)
        }
        else {
            res.json(item)
        }

    })
})

todoRouter.route("/todoArr/:id").get((req, res) => {
    const course = Item.find(c => c.id === parseInt(req.params.id));

    (!course ? res.status(404).send(`this id has not Given in data ${course}`) : res.send(course))
})




todoRouter.route("/addTodo").post((req, res) => {
    const { error } = validatedFunction(req.body)
    var item = new Item();

    if (error) {
        res.status(400).send(result.error.details[0].message)
        alert(result.error.details[0].message)
    }
    else {

        item.name = req.body.name;
        item.save()
            .then(item => {
                res.send('Item added successfully==>>===');
            })
            .catch(err => {
                res.status(400).send("unable to save to database");
            });
    }
})

todoRouter.route('/api/updateTodo/:id').put((req, res) => {
    // validate
    // if invalid, return 400 - bad request

    const { error } = validatedFunction(req.body)
    if (error) {
        res.status(400).send(result.error.details[0].message)
        return;
    }

    const doc = { name: req.body.name }

    Item.update({ _id: req.params.id }, doc, (err, result) => {
        if (err)
            res.send(err);
        res.send('Expense successfully updated!');
    });
})






todoRouter.route('/api/deleteTodo/:id').delete((req, res) => {

    Item.find({ _id: req.params.id }).remove().exec(function (err, expense) {
        {
            (err) ?
                res.send(err) :
                res.json('Todo successfully deleted!')
        }
    })
})


// Person Api

todoRouter.route("/add-person").post((req, res) => {
    let uuid = new Date().getTime()
    req.body.id = uuid
    persons.push(req.body)
    res.send(req.body);
})

todoRouter.route("/delete-person/:id").delete((req, res) => {
    let isDeleted = false
    let newPersonsList = [];
    persons.map(item => {
        item.id == req.params.id ?
            isDeleted = true
            :
            newPersonsList.push(item)
    })
    persons = newPersonsList
    isDeleted == undefined ?
        res.status(400).send("User No found") :
        res.send({ id: req.params.id })
})

todoRouter.route("/getAll-person").get((req, res) => {
    value = req.query.search;
    if (value) {
        res.send(persons.filter(person => {
            if (person.name.toLowerCase().includes(value.toLowerCase())) {
                return person
            }
        }))
    }
    else
        res.send(persons)
})

todoRouter.route("/getById-person/:id").get((req, res) => {
    let user = persons.filter(item => item.id == req.params.id)
    user.length ?
        res.send(user[0])
        : res.status(404).send("User No found")
})

todoRouter.route("/update-person/:id").put((req, res) => {
    req.body.id = req.params.id
    let newPersonsList = persons.map(item => item.id == req.params.id ? req.body : item)
    persons = newPersonsList
    res.send(req.body);
})






function validatedFunction(todo) {
    schema = {
        name: Joi.string().min(3).required()
    }
    return Joi.validate(todo, schema);
}

module.exports = todoRouter;
