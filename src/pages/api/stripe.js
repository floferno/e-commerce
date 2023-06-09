import Stripe from './stripe'
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);
// console.log(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY)


export default async function handler(req, res) {
    if (req.method === 'POST') {
        console.log(req.body, "ini req.body")
        try {
            const params = {
                submit_type: 'pay',
                mode: 'payment',
                payment_method_types: ['card'],
                billing_address_collection: 'auto',
                shipping_options: [
                    {
                        shipping_rate: 'shr_1MfxKIJAqfO7NahNbvQmTEbz',
                        shipping_rate: 'shr_1MfxLfJAqfO7NahNcElnDeFF'
                    }
                ],
                line_items: req.body.map((item) => {
                    const img = item.image[0].asset._ref
                    const newImg = img.replace('image-', 'https://cdn.sanity.io/images/tunsie8m/production/').replace('-webp', '.webp')

                    return {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: item.name,
                                images: [newImg]
                            },
                            unit_amount: item.price * 100
                        },
                        adjustable_qty: {
                            enabled: true,
                            minimum: 1
                        },
                        qty: item.qty
                    }
                }),
                success_url: `${req.headers.origin}/?success=true`,
                cancel_url: `${req.headers.origin}/?canceled=true`,
            }
            // Create Checkout Sessions from body params.
            const session = await stripe.checkout.sessions.create(params);
            res.status(200).json(session);
        } catch (err) {
            res.status(err.statusCode || 500).json(err.message);
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}