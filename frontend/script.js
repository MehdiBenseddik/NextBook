// Fetch book recommendations and display them
fetch('/recommendations')
  .then(response => response.json())
  .then(books => {
    books.forEach((book, index) => {
      document.getElementById(`book-title-${index}`).innerText = book.title;
      document.getElementById(`book-author-${index}`).innerText = book.author;
      document.getElementById(`book-cover-${index}`).src = book.coverUrl;
    });
  })
  .catch(error => console.error('Error fetching books:', error));
