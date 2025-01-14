const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

let books = [
  { id: 1, title: "1984", author: "George Orwell" },
  { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee" },
  { id: 3, title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  let bookListHTML = books
    .map(
      (book) => `
        <li>
          <div class="book-details">
            <span>${book.title} - ${book.author}</span>
          </div>
          <div class="actions">
            <button onclick="loadUpdateForm(${book.id})" class="update-btn">Güncelle</button>
            <button onclick="deleteBook(${book.id})" class="delete-btn">Sil</button>
          </div>
        </li>
      `
    )
    .join("");

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Kitap Listesi</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f1f5f9;
          margin: 0;
          padding: 20px;
        }
        h1 {
          color: #333;
          text-align: center;
        }
        ul {
          list-style-type: none;
          padding: 0;
        }
        li {
          background: #fff;
          margin: 10px 0;
          padding: 15px;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .book-details {
          font-size: 16px;
          color: #444;
        }
        .actions button {
          border: none;
          border-radius: 5px;
          padding: 8px 12px;
          margin-left: 10px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .update-btn {
          background-color: #007bff;
          color: white;
        }
        .update-btn:hover {
          background-color: #0056b3;
        }
        .delete-btn {
          background-color: #ff5c5c;
          color: white;
        }
        .delete-btn:hover {
          background-color: #d9534f;
        }
        .form-container {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }
        form {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          width: 48%;
        }
        form h2 {
          color: #333;
        }
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        input {
          width: calc(100% - 20px);
          padding: 10px;
          margin-bottom: 15px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        button[type="submit"],
        button[type="button"] {
          background-color: #28a745;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
        }
        button[type="submit"]:hover,
        button[type="button"]:hover {
          background-color: #218838;
        }
        #updateForm {
          display: none;
        }
      </style>
    </head>
    <body>
      <h1>Kitap Listesi</h1>
      <ul>${bookListHTML}</ul>

      <div class="form-container">
        <form method="POST" action="/books">
          <h2>Yeni Kitap Ekle</h2>
          <label for="title">Kitap Başlığı:</label>
          <input type="text" name="title" id="title" required />
          
          <label for="author">Yazar:</label>
          <input type="text" name="author" id="author" required />
          
          <button type="submit">Kitap Ekle</button>
        </form>

        <form id="updateForm">
          <h2>Kitap Güncelle</h2>
          <label for="updateTitle">Kitap Başlığı:</label>
          <input type="text" id="updateTitle" required />
          
          <label for="updateAuthor">Yazar:</label>
          <input type="text" id="updateAuthor" required />
          
          <button type="button" onclick="updateBook()">Güncelle</button>
        </form>
      </div>

      <script>
        let currentBookId;

        function loadUpdateForm(id) {
          const book = ${JSON.stringify(books)}.find((b) => b.id === id);
          if (book) {
            currentBookId = id;
            document.getElementById("updateForm").style.display = "block";
            document.getElementById("updateTitle").value = book.title;
            document.getElementById("updateAuthor").value = book.author;
          }
        }

        async function updateBook() {
          const title = document.getElementById("updateTitle").value;
          const author = document.getElementById("updateAuthor").value;

          const response = await fetch('/books/' + currentBookId, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, author }),
          });

          if (response.ok) {
            location.reload();
          } else {
            alert('Kitap güncellenemedi.');
          }
        }

        async function deleteBook(id) {
          const response = await fetch('/books/' + id, { method: 'DELETE' });
          if (response.ok) {
            location.reload();
          } else {
            alert('Kitap silinemedi.');
          }
        }
      </script>
    </body>
    </html>
  `);
});

app.post("/books", (req, res) => {
  const { title, author } = req.body;
  const newBook = {
    id: books.length ? books[books.length - 1].id + 1 : 1,
    title,
    author,
  };
  books.push(newBook);
  res.redirect("/");
});

app.put("/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const { title, author } = req.body;

  const book = books.find((book) => book.id === bookId);

  if (book) {
    if (title) book.title = title;
    if (author) book.author = author;

    res.status(200).send({ message: "Kitap güncellendi.", book });
  } else {
    res.status(404).send({ message: "Kitap bulunamadı." });
  }
});

app.delete("/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  books = books.filter((book) => book.id !== bookId);
  res.status(200).send({ message: "Kitap silindi." });
});

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});
