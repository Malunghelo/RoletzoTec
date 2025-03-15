document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('.content-section');
    const navbarLinks = document.querySelectorAll('.navbar a');
    const navbarB = document.getElementById('navbar-b');
    const header = document.querySelector('.header');
    const cartElement = document.querySelector('.cart p');
    const cartDrawer = document.querySelector('.cart-drawer');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const overlay = document.querySelector('.overlay');
    const proceedToCheckoutButton = document.querySelector('.proceed-to-checkout');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();

    // Function to hide all sections
    function hideAllSections() {
        sections.forEach(section => {
            section.style.display = 'none';
        });
    }

    // Function to load content dynamically
    function loadContent(url, sectionId) {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                // Insert the loaded content into the section
                const section = document.getElementById(sectionId);
                if (section) {
                    section.innerHTML = data;
                    section.style.display = 'block'; // Show the section
                }

                // Execute scripts after the content is loaded
                if (sectionId === 'content-sell') {
                    // Load and execute the sell-form.js logic
                    const script = document.createElement('script');
                    script.src = 'sell-form.js';
                    script.onload = () => {
                        // Initialize sell-specific logic here
                        initializeSellSection();
                    };
                    document.body.appendChild(script);
                } else if (sectionId === 'content-home') {
                    // Attach event listeners to "Add to Cart" buttons in home.html
                    const addToCartButtons = document.querySelectorAll('.add-to-cart');
                    addToCartButtons.forEach(button => {
                        button.addEventListener('click', function () {
                            const productId = this.getAttribute('data-id');
                            addToCart(productId);
                        });
                    });
                }
            })
            .catch(error => console.error(`Error loading ${url}:`, error));
    }

    // Function to initialize sell section
    function initializeSellSection() {
        // Add sell-specific logic here
        const sellForm = document.getElementById('sell-form');
        if (sellForm) {
            sellForm.addEventListener('submit', function (e) {
                e.preventDefault();
                // Handle form submission
                alert('Sell form submitted');
            });
        }
    }

    // Function to show a specific section
    function showSection(sectionId) {
        hideAllSections();

        // Load content dynamically based on the sectionId
        if (sectionId === 'content-home') {
            loadContent('home.html', sectionId);
        } else if (sectionId === 'content-sell') {
            loadContent('sell.html', sectionId);
        } else if (sectionId === 'content-contact') {
            loadContent('contact.html', sectionId);
        } else {
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.display = 'block';
            }
        }

        // Update active class for navigation links
        navbarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-target') === sectionId) {
                link.classList.add('active');
            }
        });

        // Update the URL hash
        const hash = `#${sectionId.replace('content-', '')}`;
        history.pushState(null, null, hash);

        // Header shrink logic
        if (['content-sell', 'content-contact'].includes(sectionId)) {
            navbarB.classList.add('hidden');
            header.classList.add('shrink');
        } else {
            navbarB.classList.remove('hidden');
            header.classList.remove('shrink');
        }
    }

    // Add click event listeners to navigation links
    navbarLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-target');
            showSection(targetSection);
        });
    });

    // Handle hash change (e.g., when the user navigates back/forward)
    function handleHashChange() {
        const hash = window.location.hash.substring(1);
        const sectionId = `content-${hash}`;
        if (document.getElementById(sectionId)) {
            showSection(sectionId);
        } else {
            showSection('content-home'); // Default to home if the section doesn't exist
        }
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Initial load based on the current hash
    handleHashChange();

    // Cart functionality
    // Open/close cart drawer
    document.querySelector('.cart').addEventListener('click', function () {
        cartDrawer.classList.toggle('open');
        overlay.classList.toggle('active');
        renderCartItems();
    });

    // Close cart drawer when close button is clicked
    document.querySelector('.cart-drawer .close-btn').addEventListener('click', function () {
        cartDrawer.classList.remove('open');
        overlay.classList.remove('active');
    });

    // Close cart drawer when clicking outside
    overlay.addEventListener('click', function () {
        cartDrawer.classList.remove('open');
        overlay.classList.remove('active');
    });

    // Add to cart functionality
    function addToCart(productId) {
        const productCard = document.querySelector(`.add-to-cart[data-id="${productId}"]`).closest('.product-card');
        const productImage = productCard.querySelector('.product-image').src;
        const productName = productCard.querySelector('.product-name').textContent;
        const productPrice = parseFloat(productCard.querySelector('.product-price').textContent.replace('$', ''));

        const product = {
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
        };

        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
    }

    // Update cart count
    function updateCartCount() {
        cartElement.textContent = cart.length;
    }

    // Render cart items in the drawer
    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            // Show empty cart image and message
            document.querySelector('.empty-cart').style.display = 'block';
            document.querySelector('.proceed-to-checkout').style.display = 'none';
            document.querySelector('.cart-total').style.display = 'none'; // Hide total
        } else {
            // Hide empty cart image and message
            document.querySelector('.empty-cart').style.display = 'none';
            document.querySelector('.proceed-to-checkout').style.display = 'block';
            document.querySelector('.cart-total').style.display = 'block'; // Show total

            // Render cart items
            cart.forEach((item, index) => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');

                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    </div>
                    <button class="delete-item" data-index="${index}">Delete</button>
                `;
                cartItemsContainer.appendChild(cartItem);
                total += item.price;
            });
        }

        cartTotalElement.textContent = total.toFixed(2);

        // Add event listeners to delete buttons
        const deleteButtons = document.querySelectorAll('.delete-item');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function () {
                const itemIndex = this.getAttribute('data-index');
                deleteCartItem(itemIndex);
            });
        });
    }

    // Delete item from cart
    function deleteCartItem(index) {
        cart.splice(index, 1); // Remove the item from the cart array
        localStorage.setItem('cart', JSON.stringify(cart)); // Update localStorage
        updateCartCount(); // Update the cart count in the header
        renderCartItems(); // Re-render the cart items
    }

    // Proceed to checkout
    proceedToCheckoutButton.addEventListener('click', function () {
        alert('Proceeding to checkout...');
        // Add your checkout logic here
    });
});