import React, { useState } from 'react'
import {
    AiOutlineMinus, AiOutlinePlus, AiOutlineStar, AiFillStar
} from 'react-icons/ai'
import { client, urlFor } from '../../../lib/client'
import { Product } from '../../../components'
import { useStateContext } from '../../../context/StateContext'
import Image from 'next/image'

const ProductDetail = ({ product, products }) => {
    const { image, name, details, price } = product
    const [index, setIndex] = useState(0)
    const { decrementQty, incrementQty, qty, onAdd } = useStateContext()

    return (
        <div>
            <div className="product-detail-container">
                <div>
                    <div className='image-container'>
                        <Image className="product-detail-image" src={urlFor(image && image[0])} alt={`image`} />
                    </div>
                    <div className='small-images-container'>
                        {image?.map((item, i) => (
                            <Image
                                key={i}
                                src={urlFor(item)}
                                className={i == index ? 'small-image selected-image' : 'small-image'}
                                onMouseEnter={() => setIndex(i)}
                                alt={`image`}
                            />
                        ))}
                    </div>
                </div>
                <div className="product-detail-desc">
                    <h1>
                        {name}
                    </h1>
                    <div className='reviews'>
                        <div>
                            <AiFillStar />
                            <AiFillStar />
                            <AiFillStar />
                            <AiFillStar />
                            <AiOutlineStar />
                        </div>
                        <p>(20)</p>
                    </div>
                    <h4>Details:</h4>
                    <p>{details}</p>
                    <p className="price">${price}</p>
                    <div className="quantity">
                        <h3>Quantity:</h3>
                        <p className='quantity-desc'>
                            <span className="minus" onClick={decrementQty}><AiOutlineMinus /></span>
                            <span className="num">{qty}</span>
                            <span className="plus" onClick={incrementQty}><AiOutlinePlus /></span>
                        </p>
                    </div>
                    <div className='buttons'>
                        <button type="button" className='add-to-cart' onClick={() => onAdd(product, qty)}>Add to Cart</button>
                        <button type="button" className='buy-now' onClick="">Buy Now</button>
                    </div>
                </div>
            </div>
            <div className='maylike-products-wrapper'>
                <h2>
                    You may also like
                </h2>
                <div className='marquee'>
                    <div className="maylike-products-container track">
                        {products.map(item => (
                            <Product key={item._id} product={item} />
                            // console.log(item, "ini item")
                        )
                        )}
                    </div>
                </div>
            </div>

        </div>
    )
}

export const getStaticPaths = async () => {
    //give me all teh products but dont return all the data, just return the current slug
    const query = `*[_type == "product"]{
        slug{
            current
        }
    }`

    const products = await client.fetch(query)
    const paths = products.map((product) => ({ // < ( means returning the object
        params: {
            slug: product.slug.current
        }
    }))
    return {
        paths,
        fallback: 'blocking'
    }
}

export const getStaticProps = async ({ params: { slug } }) => {
    const query = `*[_type == "product" && slug.current == '${slug}'][0]`
    const productsQuery = `*[_type == "product"]`

    const product = await client.fetch(query)
    const products = await client.fetch(productsQuery)


    return {
        props: { products, product }
    }
}

export default ProductDetail