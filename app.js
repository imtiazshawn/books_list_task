const apiUrl = "https://gutendex.com/books";
let currentPage = 1;
let searchQuery = "";
let genreFilter = "";
const bookList = document.getElementById("book-list");
const searchBar = document.getElementById("search-bar");
const genreSelect = document.getElementById("genre-filter");
const nextPageBtn = document.getElementById("next-page");
const prevPageBtn = document.getElementById("prev-page");
const pageNumberDisplay = document.getElementById("page-number");
let loading = true;
let error = null;

// Fetching API
async function fetchBooks() {
  loading = true;
  updateLoader();
  try {
    const response = await fetch(`${apiUrl}?page=${currentPage}&search=${searchQuery}`);
    const data = await response.json();
    displayBooks(data.results);
    updatePagination(data);
  } catch (err) {
    error = err;
    console.error("Error fetching books:", error);
  } finally {
    loading = false;
    updateLoader();
  }
}

// Loader
function updateLoader() {
  if (loading) {
    bookList.innerHTML = `<div id="loader"></div>`;
  } else {
    bookList.style.display = 'flex';
  }
}

// Display The Books
function displayBooks(books) {
  bookList.innerHTML = "";
  books.forEach(book => {
    const bookCard = document.createElement("div");
    bookCard.className = "book-card";

    const coverImg = book.formats['image/jpeg'] || 'default-cover.jpg';
    
    const isFavorite = JSON.parse(localStorage.getItem('wishlist'))?.some(item => item.id === book.id);

    bookCard.innerHTML = `
      <img src="${coverImg}" alt="${book.title}">
      <div class="book-info">
        <h3>${book.title}</h3>
        <p>Author: ${book.authors.map(author => author.name).join(', ')}</p>
        <p>Genre: ${book.subjects.slice(0, 2).join(', ') || 'Unknown'}</p>
        <p>ID: ${book.id}</p>
      </div>
      <span class="wishlist-btn ${isFavorite ? 'added' : ''}">
        <span class="material-symbols-outlined">
          ${isFavorite ? 'bookmarks' : 'favorite'}
        </span>
      </span>
    `;

    bookCard.querySelector(".wishlist-btn").addEventListener("click", () => {
      toggleWishlist(book);
      displayBooks(books);
    });

    bookList.appendChild(bookCard);
  });
}

// Wishlist functionality
function toggleWishlist(book) {
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  const index = wishlist.findIndex(item => item.id === book.id);
  
  if (index !== -1) {
    wishlist.splice(index, 1);
  } else {
    wishlist.push(book);
  }
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Pagination
nextPageBtn.addEventListener("click", () => {
  currentPage++;
  fetchBooks();
  updatePageNumber();
});

prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchBooks();
    updatePageNumber();
  }
});

function updatePageNumber() {
  pageNumberDisplay.innerText = currentPage;
}

// Search
searchBar.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  currentPage = 1;
  fetchBooks();
  updatePageNumber();
});

// Genre
genreSelect.addEventListener("change", (e) => {
  genreFilter = e.target.value;
  currentPage = 1;
  fetchBooks();
  updatePageNumber();
});

fetchBooks();
updatePageNumber();