const product = [
    {
        id: 1,
        image: 'https://unsplash.com/photos/LuHP_F5yoGQ/download?force=true&w=640',
        title: 'Headphones',
        price: 'R150'
    },

    {
        id: 2,
        image: 'https://unsplash.com/photos/qAunQaxAY-M/download?force=true&w=640',
        title: 'Microphone',
        price: 'R250'
    },
    {
        id: 3,
        image: 'https://unsplash.com/photos/JF0R2sMFbJU/download?force=true&w=640',
        title: 'Smart Watch',
        price: 'R950'
    },
    {
        id: 4,
        image: 'https://unsplash.com/photos/WGI1iEvRn5k/download?force=true&w=640',
        title: 'HP Laptop Next Gen',
        price: 'R5000'
    },
    {
        id: 5,
        image: 'https://media.istockphoto.com/id/1170073824/photo/gamer-work-space-concept-top-view-a-gaming-gear-mouse-keyboard-joystick-headset-mobile.webp?a=1&b=1&s=612x612&w=0&k=20&c=53gDtTY0dQg1KzyWiq1b4B6YJBB6ZNHcxxQTLtXTuCw=',
        title: '250D DSLR Camera',
        price: 'R800'
    },
    {
        id: 6,
        image: 'https://unsplash.com/photos/Hpaq-kBcYHk/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fHBjfGVufDB8fHx8MTc0MTc5MTg3NXww&force=true',
        title: 'Metal Dask Lamp',
        price: 'R600'
    },
    {
        id: 7,
        image: 'https://unsplash.com/photos/Hpaq-kBcYHk/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fHBjfGVufDB8fHx8MTc0MTc5MTg3NXww&force=true',
        title: 'Z Flip Foldable Mobile',
        price: 'R2050'
    },
    {
        id: 8,
        image: 'https://unsplash.com/photos/Hpaq-kBcYHk/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fHBjfGVufDB8fHx8MTc0MTc5MTg3NXww&force=true',
        title: 'Air Pods Pro',
        price: 'R300'
    },
]

const all = [...new Set(product.map((item)=>
{return item}))]

let cart = document.getElementById("root")
cart.innerHTML = all.map((item)=>
{
    var {image, title, price} = item;
    return(
        `<div class="box">
            <div class="img-box">
                <img src=${image}></img>
                </div>
                <div class="left">
                    <p>${title}</p>
                    <h2>${price}</h2>
                    <button>Add to Cart</button>
                </div>
            </div>`  
    )
}).join('')