import './index.css';

import axios from 'axios';
import { useState } from 'react';

import { useFormik } from 'formik';
import * as yup from 'yup';
import { useEffect } from 'react';

let baseURL = '';
if (window.location.href.split(':')[0] === 'http') {
    baseURL = 'http://localhost:5001';
};



const CRUD = () => {

    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [responseMessage, setResponseMessage] = useState(null);
    const [responseProducts, setResponseProducts] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [load, setLoad] = useState(false);
    const [editingData, setEditingData] = useState({});

    // const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {

        axios.get(`${baseURL}/products`)
            .then((res) => {
                console.log('response "all products" =========>: ', res.data);
                setResponseProducts(res.data.data);
                console.log('responseProducts :', responseProducts);
            })
            .catch((err) => {
                console.log('Error: ', err);
            })

    }, [load])

    const deleteProduct = (id) => {

        console.log(' This is deleteProduct');
        console.log(id);

        axios.delete(`${baseURL}/product/${id}`)
            .then((res) => {
                console.log('delete response =====>', res);
                setLoad(!load);
            })
            .catch((err) => {
                console.log('delete Error =====>', err);
            })
    }

    const editProduct = (product) => {
        setIsEditing(!isEditing);
        setEditingData(product);

        updateFormik.setFieldValue('productName', product.name);
        updateFormik.setFieldValue('price', product.price);
        updateFormik.setFieldValue('description', product.description);
    }

    const formik = useFormik({
        initialValues: {
            productName: "",
            price: "",
            description: ""
        },

        validationSchema:

            yup.object({

                productName: yup
                    .string('Enter your price')
                    .required('Price is required')
                    .min(3, "please enter more then 3 characters ")
                    .max(20, "please enter within 20 characters "),

                price: yup
                    .string('Enter price of product')
                    .required('Price is required')
                    // .number("Enter a valid Price in numbers")
                    .min(1, "please enter more then 3 characters ")
                    .max(20, "please enter within 20 characters "),

                description: yup
                    .string("Please enter your description")
                    .required("description is required")
                    .min(8, "Minimum 8 characters")
                    .max(150, "Minimum 8 characters"),


            }),

        onSubmit: (values) => {
            console.log("values : ", values);
            console.log("Hello");

            axios.post(`${baseURL}/product`, {
                name: values.productName,
                price: values.price,
                description: values.description,
            })
                .then((response) => {
                    // console.log(`response : ${response}`);///// return [object Object]
                    console.log('`response : `', response.data);
                    console.log(`data added`);
                    setResponseMessage(response.data.message)
                    setIsAdding(false);
                    setTimeout(() => {
                        setResponseMessage(null)
                    }, 10000);
                    setLoad(!load);

                    // console.log('responseProducts:====> ' ,responseProducts);
                })
                .catch((err) => {
                    console.log(`Error : ${err}`);
                })
        }
    });

    const updateFormik = useFormik({
        initialValues: {
            productName: editingData.editName,
            price: editingData.editPrice,
            description: editingData.editDescription
        },

        validationSchema:

            yup.object({

                productName: yup
                    .string('Enter your price')
                    .required('Price is required')
                    .min(3, "please enter more then 3 characters ")
                    .max(20, "please enter within 20 characters "),

                price: yup
                    .string('Enter price of product')
                    .required('Price is required')
                    // .number("Enter a valid Price in numbers")
                    .min(1, "please enter more then 3 characters ")
                    .max(20, "please enter within 20 characters "),

                description: yup
                    .string("Please enter your description")
                    .required("description is required")
                    .min(8, "Minimum 8 characters")
                    .max(150, "Minimum 8 characters"),


            }),

        onSubmit: (updateValues) => {


            console.log("updateValues : ======>>>  ", updateValues);
            console.log("this is editing handler");
            setIsEditing(false);

            console.log(' This is deleteProduct');
            console.log(editingData.id);

            axios.put(`${baseURL}/product/${editingData.id}`, {
                name: updateValues.productName,
                price: updateValues.price,
                description: updateValues.description
            })
                .then((res) => {
                    console.log('delete response =====>', res);
                    setLoad(!load);
                })
                .catch((err) => {
                    console.log('delete Error =====>', err);
                })
        }
    });


    return (
        <div>
            <h1>CRUD Operation With Express and React</h1>

            <button
                className='addBtn'
                onClick={() => {
                    setIsAdding(true);
                }}>
                Add Product
            </button>

            <div className="addingForm">
                {
                    (isAdding) ?

                        <form onSubmit={formik.handleSubmit}>
                            <div className="inputDiv">
                                <label htmlFor="productName">Product name : </label>
                                <input
                                    type="text"
                                    id="productName"
                                    value={formik.values.productName}
                                    placeholder="Enter you name :"
                                    onChange={formik.handleChange}
                                />
                                {(formik.touched.productName && Boolean(formik.errors.productName)) ?
                                    <p className="inputError">{formik.errors.productName}</p> : <p className="inputError"></p>}
                            </div>

                            <div className="inputDiv">
                                <label htmlFor="price">Price : </label>
                                <input
                                    type="number"
                                    id="price"
                                    value={formik.values.price}
                                    placeholder="Enter your Price :"
                                    onChange={formik.handleChange}
                                />
                                {(formik.touched.price && Boolean(formik.errors.price)) ?
                                    <p className="inputError">{formik.errors.price}</p> : <p className="inputError"></p>}
                            </div>

                            <div className="inputDiv">
                                <label htmlFor="description">Description : </label>
                                <input
                                    type="text"
                                    id="description"
                                    value={formik.values.description}
                                    placeholder="Enter your description :"
                                    onChange={formik.handleChange}
                                />
                                {(formik.touched.description && Boolean(formik.errors.description)) ?
                                    <p className="inputError">{formik.errors.description}</p> : <p className="inputError"></p>}
                            </div>


                            <button type="submit">Save</button>
                        </form>
                        : null

                }
                <h3>{responseMessage}</h3>
            </div>

            <div className="products">
                {
                    responseProducts.map((eachProduct, i) => {
                        // console.log('eachProduct:===>', eachProduct);

                        return (
                            <div className="eachProduct" key={i}>

                                {
                                    (isEditing && eachProduct.id === editingData.id) ?

                                        <div className="editingProduct">
                                            <form onSubmit={updateFormik.handleSubmit}>
                                                <div className="inputDiv">
                                                    <label htmlFor="productName">Product name : </label>
                                                    <input
                                                        type="text"
                                                        id="productName"
                                                        value={updateFormik.values.productName}
                                                        // value={eachProduct.name}
                                                        placeholder="Enter you name :"
                                                        onChange={updateFormik.handleChange}
                                                    />
                                                    {(updateFormik.touched.productName && Boolean(updateFormik.errors.productName)) ?
                                                        <p className="inputError">{updateFormik.errors.productName}</p> : <p className="inputError"></p>}
                                                </div>

                                                <div className="inputDiv">
                                                    <label htmlFor="price">Price : </label>
                                                    <input
                                                        type="number"
                                                        id="price"
                                                        value={updateFormik.values.price}
                                                        // value={eachProduct.price}
                                                        placeholder="Enter your Price :"
                                                        onChange={updateFormik.handleChange}
                                                    />
                                                    {(updateFormik.touched.price && Boolean(updateFormik.errors.price)) ?
                                                        <p className="inputError">{updateFormik.errors.price}</p> : <p className="inputError"></p>}
                                                </div>

                                                <div className="inputDiv">
                                                    <label htmlFor="description">Description : </label>
                                                    <input
                                                        type="text"
                                                        id="description"
                                                        value={updateFormik.values.description}
                                                        // value={eachProduct.description}
                                                        placeholder="Enter your description :"
                                                        onChange={updateFormik.handleChange}
                                                    />
                                                    {(updateFormik.touched.description && Boolean(updateFormik.errors.description)) ?
                                                        <p className="inputError">{updateFormik.errors.description}</p> : <p className="inputError"></p>}
                                                </div>


                                                <button type="submit" >Save</button>
                                            </form>
                                            <button onClick={() => {
                                                setIsEditing(false);
                                            }}>Cancel</button>
                                        </div>

                                        :

                                        <div>
                                            <p className="productname">{eachProduct.name}</p>
                                            <p className="productPrize">{eachProduct.price}</p>
                                            <p className="productDescription">{eachProduct.description}</p>

                                            <button
                                                className="editing"
                                                onClick={() => {
                                                    // setIsEditing(true);
                                                    // setEditingId(eachProduct.id)
                                                    editProduct(eachProduct);
                                                    console.log('editingData ===> ', editingData);
                                                }}
                                            >
                                                Edit
                                            </button>

                                            <button className="delete"
                                                onClick={() => {
                                                    deleteProduct(eachProduct.id);
                                                }}>
                                                Delete
                                            </button>
                                        </div>
                                }
                            </div>
                        )
                    })
                }
            </div>


        </div>
    )
}


export default CRUD;