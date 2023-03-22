const express = require('express')
const app = express()
const port = 3030
const path = require('path')
const bodyParser = require('body-parser')
const multer = require('multer');
var fs = require('fs');

app.use(bodyParser.urlencoded({ extended: true }))

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {

        var dir = './uploads';

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        var tenGoc = file.originalname;
        arr = tenGoc.split('.');
        let newFileName = '';
        for (var i = 0; i < arr.length; i++) {
            if (i != arr.length - 1) {
                newFileName += arr[i];
            } else {
                newFileName += ('-' + Date.now() + '.' + arr[i]);
            }
        }
        cb(null, newFileName)
    }
})

// Bai 4
var upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 } })

var myUpload = upload.single('myFile')

app.post('/uploadfile', (req, res, next) => {
    myUpload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.send("Kích thước file lớn hơn 1MB")
        }
        res.send("Upload thành công")
    })
})

// Bai 5
var imageUpload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/gif' || file.mimetype === 'image/jpg') {
            file.originalname = file.originalname.replace(/\.png|\.gif|\.jpg/i, '.jpeg'); // chuyển đổi phần mở rộng file upload sang .jpg
            return cb(null, true);
        }
        return cb(null, false);
    }
})

app.post('/upload/photo', imageUpload.array('myImage'), (req, res, next) => {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send("Up load file thành công")
})


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/Upload.html');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});