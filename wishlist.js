let loading = true;

function renderLoader() {
    const wishlistBooks = document.getElementById("wishlist-books");
    if (loading) {
        wishlistBooks.innerHTML = '<div id="loader"></div>';
    }
}

function toggleWishlist(bookId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const index = wishlist.findIndex(item => item.id === bookId);

    if (index !== -1) {
        wishlist.splice(index, 1);
    } else {
        wishlist.push(book);
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    renderWishlist();
}

function renderWishlist() {
    loading = true;
    renderLoader();

    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const wishlistBooks = document.getElementById("wishlist-books");

    setTimeout(() => {
        loading = false;
        renderLoader();

        if (wishlist.length === 0) {
            wishlistBooks.innerHTML = `
                <div class="empty-wishlist">
                    <span class="material-symbols-outlined empty-icon">dictionary</span>
                    <p>Your wishlist is empty.</p>
                </div>
            `;
            return;
        }

        wishlistBooks.innerHTML = wishlist
            .map((book) => {
                const coverImg = book.formats["image/jpeg"] || "default-cover.jpg";
                const isFavorite = true;
                return `
                    <div class="book-card">
                        <img src="${coverImg}" alt="${book.title}">
                        <div class="book-info">
                            <h3>${book.title}</h3>
                            <p>Author: ${book.authors.map((author) => author.name).join(", ")}</p>
                            <p>Genre: ${book.subjects.slice(0, 2).join(", ") || "Unknown"}</p>
                        </div>
                        <span class="wishlist-btn ${isFavorite ? "added" : ""}" 
                              onclick='toggleWishlist(${book.id})'>
                            <span class="material-symbols-outlined">
                                ${isFavorite ? "bookmarks" : "favorite"}
                            </span>
                        </span>
                    </div>
                `;
            })
            .join("");
    }, 1000);
}

renderWishlist();
