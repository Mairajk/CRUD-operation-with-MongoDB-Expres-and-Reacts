
////===============>> starting  <<=============\\\\



import express from "express";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";

let productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now }
})

const productModel = mongoose.model('products', productSchema);


const app = express();

const port = process.env.PORT || 5001;

const mongodbURI = process.env.mongodbURI || 'mongodb+srv://MairajK:workhardin@cluster0.sihvwcq.mongodb.net/estore?retryWrites=true&w=majority';


app.use(cors());
app.use(express.json());

const products = [];

app.post('/product', (req, res) => {
    const body = req.body;

    if (
        !body.name
        ||
        !body.price
        ||
        !body.description
    ) {
        res.status(400).send({
            message: 'required paramater missing'
        });
        return;
    }

    console.log(body.name);
    console.log(body.price);
    console.log(body.description);

    productModel.create({
        name: body.name,
        price: body.price,
        description: body.description,
        date: new Date().toString()
    },
        (err, saved) => {
            if (!err) {
                res.send({
                    message: 'product added successfully',
                    data: saved
                });
            } else {
                res.status(500).send({
                    message: 'server error'
                });
            };
        });
});


app.get('/products', (req, res) => {

    productModel.find({}, (err, data) => {
        if (!err) {
            res.send({
                message: 'successfully get all products :',
                data: data
            });
        } else {
            res.status(500).send({
                message: 'server error'
            })
        }

    })

})


app.get('/product/:id', (req, res) => {

    const id = req.params.id;

    let isFound = false;

    for (let i = 0; i < products.length; i++) {

        if (products[i].id === id) {
            res.send({
                message: 'product :',
                date: products[i]
            });
            isFound = true;
            break;
        }

    }
    if (!isFound) {
        res.status(404).send({
            message: 'product not found'
        });
    }
    return;

})

app.delete('/product/:id', (req, res) => {
    const id = req.params.id;

    productModel.deleteOne({ _id: id }, (err, deletedProduct) => {
        if (!err) {
            if (deletedProduct.deletedCount != 0) {
                res.send({
                    message: 'product deleted successfully',
                    data: deletedProduct
                });
            } else {
                res.status(404).send({
                    message: 'product not found of this id : ',
                    request_id: id
                });
            }
        } else {
            res.status(500).send({
                message: 'server error'
            });
        }
    });
});

app.put('/product/:id', async (req, res) => {
    const body = req.body;
    const id = req.params.id;

    if (
        !body.name
        ||
        !body.price
        ||
        !body.description
    ) {
        res.status(400).send({
            message: 'required paramater missing'
        });
        return;
    }

    try {
        let data = await productModel.findByIdAndUpdate(id, {
            name: body.name,
            price: body.price,
            description: body.description,
        },
            { new: true }
        ).exec();
        console.log(' updated data :===>', data);

        res.send({
            message: 'product modified successfully',
            updated_Data: data
        })
    }
    catch (err) {
        res.status(500).send({
            message: 'server error'
        });
    }
});

app.get('/products/:name', (req, res) => {

    let findName = req.params.name;

    productModel.find({ name: findName }, (err, data) => {
        if (!err) {

            if (data.length !== 0) {

                res.send({
                    message: 'successfully get all products :',
                    data: data
                });
            } else {
                res.status(404).send({
                    message: 'product not found'
                })
            }

        } else {
            res.status(500).send({
                message: 'server error'
            })
        }
    })
})


const __dirname = path.resolve();

app.use("/", express.static(path.join(__dirname, "./web/build")));
app.use("*", express.static(path.join(__dirname, "./web/build/index.html")));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});



mongoose.connect(mongodbURI);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////