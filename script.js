// DOM Elements
const productGrid = document.getElementById('product-grid');
const loadingSpinner = document.getElementById('loading-spinner');
const searchBar = document.getElementById('search-bar');
const categoryFilter = document.getElementById('category-filter');
const sortFilter = document.getElementById('sort-filter');

let allProducts = []; 

// 1. Fetch Data from Local JSON
async function fetchProducts() {
    try {
        const response = await fetch('./products.json');
        allProducts = await response.json();
        
        // Hide spinner and show grid once data arrives
        loadingSpinner.classList.add('hidden');
        productGrid.classList.remove('hidden');
        
        renderProducts(allProducts);
    } catch (error) {
        loadingSpinner.innerText = "Failed to load inventory. Please try again.";
        console.error("Error fetching data:", error);
    }
}

// 2. Render Products to the DOM
function renderProducts(products) {
    productGrid.innerHTML = ''; 

    if (products.length === 0) {
        productGrid.innerHTML = '<p>No products found matching your search.</p>';
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        
        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <h2 class="product-title">${product.title}</h2>
            <div class="product-category">${product.category}</div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
        `;
        
        productGrid.appendChild(card);
    });
}

// 3. Filter and Sort Logic
function updateDashboard() {
    const searchTerm = searchBar.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    const selectedSort = sortFilter.value;

    let filteredProducts = allProducts.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (selectedSort === 'low-high') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (selectedSort === 'high-low') {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    renderProducts(filteredProducts);
}

// 4. Event Listeners
searchBar.addEventListener('input', updateDashboard);
categoryFilter.addEventListener('change', updateDashboard);
sortFilter.addEventListener('change', updateDashboard);

// Initialize
fetchProducts();