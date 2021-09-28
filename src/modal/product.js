
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var payload = new Schema({
    id: String,
    name: String,
    price: String,
    description: String,
    image: String
}, {
    collection: 'products'
});

module.exports = mongoose.model('Products', payload);