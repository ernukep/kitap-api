// API'den verileri çekmek için
async function fetchBooks() {
  try {
    const response = await fetch("http://localhost:3000/books");
    const books = await response.json();

    // Kitap listesini DOM'a ekleyelim
    const bookList = document.getElementById("book-list");
    bookList.innerHTML = ""; // Önce listeyi temizle

    books.forEach((book) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${book.title} by ${book.author}`;
      bookList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

// Sayfa yüklendiğinde verileri çek
document.addEventListener("DOMContentLoaded", fetchBooks);
