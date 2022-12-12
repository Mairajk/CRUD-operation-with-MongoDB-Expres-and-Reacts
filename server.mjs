
////===============>> starting  <<=============\\\\



import express from "express";
import cors from "cors";
import path from "path";


let productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
})

const productModel = mongoose.model('products', productSchema);


const app = express();

const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const products = [];

app.post('/product', (req, res) => {
    const body = req.body;

    if (
        !body.name
        &&
        !body.price
        &&
        body.description
    ) {
        res.status(400).send({
            message: 'required paramater missing'
        });
        return;
    }

    console.log(body.name);
    console.log(body.price);
    console.log(body.description);

    products.push({
        name: body.name,
        price: body.price,
        description: body.description,
        id: `${new Date().getTime()}`,
        date: new Date().toString()
    })

    res.send({
        message: 'product added successfully',
        name: body.name,
        price: body.price,
        description: body.description,
        date: new Date().toString()
    })
})

app.get('/products', (req, res) => {
    res.send({
        message: 'successfully get all products :',
        data: products
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

    let isFound = false;

    console.log('req.params.id === id :', id);
    // console.log('products : ===>', products);

    for (let i = 0; i < products.length; i++) {

        console.log('id ==============>>> :', id);
        console.log(' this is loop');
        console.log('products[i].id : ', products[i].id);
        if (id === products[i]?.id) {

            products.splice(i, 1)
            res.send({
                message: ' product deleted successfully ',
                deletedProduct: products[i]
            });
            isFound = true;
            break;
        }

    }
    if (!isFound) {

        console.log('found if');
        res.status(404).send({
            message: 'delete process failed : product not found'
        });
    }
    return;
})

app.put('/product/:id', (req, res) => {
    const body = req.body;
    const id = req.params.id;

    if (
        !body.name
        &&
        !body.price
        &&
        body.description
    ) {
        res.status(400).send({
            message: 'required paramater missing'
        });
        return;
    }

    console.log(body.name);
    console.log(body.price);
    console.log(body.description);

    let isFound = false;

    for (let i = 0; i < products.length; i++) {

        if (products[i].id === id) {

            products[i].name = body.name;
            products[i].price = body.price;
            products[i].description = body.description;

            res.send({
                message: 'product modified successfully',
                name: body.name,
                price: body.price,
                description: body.description,
                date: new Date().toString()
            })
            isFound = true;
            break;
        }

    }
    if (!isFound) {
        res.status(404).send({
            message: 'product updating failed : product not found'
        });
    }
    return;

})


const __dirname = path.resolve();

app.use("/", express.static(path.join(__dirname, "./web/build")));
app.use("*", express.static(path.join(__dirname, "./web/build/index.html")));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});