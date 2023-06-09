import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'


const Context = createContext()

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false) // to show products in the cart
    const [cartItems, setCartItems] = useState([]) // to store what items inside a cart
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalQty, setTotalQty] = useState(0)
    const [qty, setQty] = useState(1)
    // const [totalQtyPerItem, setTotalQtyPerItem] = useState(0)

    let foundProduct;
    let index;

    const incrementQty = () => {
        setQty((prevQty) => prevQty + 1)
    }

    const decrementQty = () => {
        setQty((prevQty) => {
            if (prevQty <= 1) return 1
            return prevQty - 1
        })
    }

    // const newCartItems = cartItems.splice(index, 1)

    const onAdd = (product, qty) => { // function adding items in cart menerima produk dan jumlah produk sbg parameter
        const checkProductInCart = cartItems.find((item) => item._id == product._id)
        // console.log(qty, "ini jumlah product")
        setTotalPrice((prevTotalPrice) => prevTotalPrice + (product.price * qty))
        setTotalQty((prevTotalQty) => prevTotalQty + qty)
        // setQty((prevQty) => prevQty => )

        if (checkProductInCart) { // if the item already in the cart then just updated the qty

            const updatedCartItems = cartItems.map((cartItem) => {
                console.log(cartItem, "ini cart item")
                if (cartItem._id == product._id) {
                    return {
                        ...cartItem,
                        qty: cartItem.qty + qty
                    }
                }
            })

            setCartItems(updatedCartItems)
        } else {
            product.qty = qty
            setCartItems([...cartItems, { ...product }])
        }
        toast.success(`${qty} ${product.name} added to the cart.`)
    }

    const toggleCartItemQty = (id, value) => {
        foundProduct = cartItems.find((item) => item._id == id)
        index = cartItems.findIndex((product) => product._id == id)

        if (value === "inc") {
            // const indexOfItems = cartItems.findIndex((item) => item._id === id)
            // console.log(indexOfItems)
            const newCartItems = cartItems.filter((item) => item._id !== id)
            setCartItems([...newCartItems, { ...foundProduct, qty: foundProduct.qty + 1 }])
            setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price)
            setTotalQty((prevTotalQty) => prevTotalQty + 1)
            console.log("tes inc")

        } else if (value === 'dec') {
            if (foundProduct.qty > 1) {
                const newCartItems = cartItems.filter((item) => item._id !== id)
                setCartItems([...newCartItems, { ...foundProduct, qty: foundProduct.qty - 1 }])
                setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price)
                setTotalQty((prevTotalQty) => prevTotalQty - 1)
                console.log("tes dec")
            }
        }
    }

    const onRemove = (product) => {
        foundProduct = cartItems.find((item) => item._id == product._id)
        const newCartItems = cartItems.filter((item) => item._id !== product._id)
        setTotalPrice((prevTotalPrice) => prevTotalPrice - (foundProduct.price * foundProduct.qty))
        setTotalQty((prevTotalQty) => prevTotalQty - foundProduct.qty)
        // setQty((prevQty) => prevQty - foundProduct.qty)
        setCartItems(newCartItems)
    }

    return (
        <Context.Provider value={{
            showCart,
            setShowCart,
            cartItems,
            totalPrice,
            totalQty,
            qty,
            incrementQty,
            decrementQty,
            onAdd,
            toggleCartItemQty,
            onRemove
        }}>
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context)