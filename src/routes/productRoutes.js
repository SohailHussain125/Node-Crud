const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const Joi = require('joi');
var productRouter = express.Router();
var Item = require('../modal/todoSchema');
const Product = require("../modal/product");
var app = express()
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const multer = require('multer');

productRouter.route("/getAll-product").get((req, res) => {
    Product.find((err, item) => {
        if (err) {
            console.log(err)
        }
        else {
            res.json(item)
        }

    })
})

const fileUpload = multer()
productRouter.route("/create-product").post(fileUpload.single('image'), (req, res) => {
    const { error } = validatedFunction(req.body)
    var product = new Product();

    if (error) {
        res.status(400).send(error.details[0].message)
        // alert(result.error.details[0].message)
    }
    else {
        product.id = new Date().getTime();
        product.name = req.body.name;
        product.price = req.body.price;
        product.description = req.body.description;
        async function upload(req) {
            let result = await streamUpload(req);
            product.image = result.url;
            product.save()
                .then(product => {
                    res.status(201).send((product));

                })
                .catch(err => {
                    res.status(400).send("unable to save to database");
                });

        }
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );

                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };
        upload(req);
    }
})



productRouter.route('/delete-product/:id').delete((req, res) => {
    console.log(req.params.id);
    Product.find({ id: req.params.id }).remove().exec(function (err, expense) {
        {
            (err) ?
                res.send(err) :
                res.json({ id: req.params.id, message: 'Todo successfully deleted!' })
        }
    })
})

productRouter.route("/getbyId-product/:id").get((req, res) => {
    let value = req.params.id;
    Product.find({ id: value }, function (err, product) {
        if (err) {
            console.log(err, ">>>>>>")
            res.status(404).send(`this id has not Given in data ${product}`)
        } else {
            product.length ? res.send(product[0]) : res.status(404).send({ Error: `this id has not Given in data ${value}`, Response: "False", })
        }
    })
})


productRouter.route("/update-product/:id").put(fileUpload.single('image'), (req, res) => {
    const { error } = validatedFunction(req.body)
    var product = new Product();


    if (error) {
        res.status(400).send(error.details[0].message)
        // alert(result.error.details[0].message)
    }
    else {
        const doc = {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description
        }
        async function upload(req) {
            let result = await streamUpload(req);
            doc.image = result.url;
            Product.updateOne({ id: req.params.id }, doc, (err, result) => {
                if (err)
                    res.send(err);
                res.send(result);
            });

        }
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );

                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };
        if (req.file) {
            upload(req);
        }
        else {
            doc.image = req.body.image;
            Product.updateOne({ id: req.params.id }, doc, (err, result) => {
                if (err) {
                    console.log(err, "err");
                    res.send(err);
                }
                res.send(result);
            });
        }
    }
})

function validatedFunction(todo) {
    schema = {
        name: Joi.string().min(3).required(),
        price: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.any()
    }
    return Joi.validate(todo, schema);
}





module.exports = productRouter;
