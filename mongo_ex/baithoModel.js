const mongoose = require('mongoose');

const BaithoSchema = new mongoose.Schema({
    tieude: {
        type: String,
        required: true
    },
    nam: {
        type: Number,
        default: 1900
    },
    tacgia: {
        type: String,
    }
});

const BaithoModel = new mongoose.model('baitho', BaithoSchema);

module.exports = BaithoModel;