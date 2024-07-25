class BookService {
    basePath = "https://localhost:7173/api/Book";

    async getBooks() {
        return fetch(this.basePath)
            .then(r => r.json());
    }


}



async function loadAllBooks() {
    const bookService = new BookService();
    try {
        const allBooks = await bookService.getBooks();
        books = allBooks; // Popolo l'array globale books
        console.log("Books loaded:", books);
        removeAllBooks(); // Rimuovo i libri esistenti per evitare duplicati

        books.forEach(book => {
            loadSingleBook(book);
        });
    } catch (error) {
        console.error("Error loading books:", error);
    }
}

async function deleteBook(id) {
    return fetch(`https://localhost:7173/api/Book/${id}`, {
        method: 'DELETE'
    }).then(() => {
        return true;
    }).catch(err => {
        console.error(err);
        return false;
    });
}


function loadSingleBook(book) {
    const listcontainer = document.getElementById("bookList");
    const bookElement = document.createElement('div');
 
    bookElement.innerHTML = `
      
    <div  class="flex flex-col altezza items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
         <img class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" src="Migliori_libri_dal_2000.jpeg" alt="">
         <div class="flex flex-col justify-between p-4 leading-normal">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${book.title}</h5>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">${book.description}</p>
            <p class="mb-3 font-small text-gray-700 dark:text-gray-400">Anno: ${book.year}</p>
            <p class="mb-3 font-small text-gray-700 dark:text-gray-400">Categoria: ${book.category.name} </p>
            <p class="mb-3 font-small text-gray-700 dark:text-gray-400">Autore: ${book.author.name} ${book.author.surname}</p>
        <div class="flex justify-between sm:gap-4">
            <button class="btn-cat"><a href="listacategorie.html">Categoria</a></button>
             <button class="btnelimina"data-id="${book.id}">Elimina</button>
            <button class="btnmodifica"data-id="${book.id}"><a href="updatelibro.html?bookId=${book.id}">Modifica</a></button>
      </div>
   </div>
</div>
    `;
    const deleteButton = bookElement.querySelector('.btnelimina');
  
    deleteButton.addEventListener('click', async () => {
        const deleted = await deleteBook(book.id);
        if (deleted) {   
            bookElement.remove();
        }
    });

    listcontainer.appendChild(bookElement);
}


let books = [];

// loadAllBooks();

// DOMContentLoaded: Questo è il tipo di evento. L'evento DOMContentLoaded viene attivato quando il documento HTML iniziale è stato completamente caricato e analizzato, senza attendere il caricamento completo delle risorse esterne.
document.addEventListener('DOMContentLoaded', (event) => {
    loadAllBooks();

    const searchButton = document.getElementById("searchButton");
    const resetButton = document.getElementById("resetButton");

    searchButton.addEventListener("click", () => {
        let searchValue = getSearchBarValue();
        let filteredBooks;

        if (!searchValue) {
            filteredBooks = [...books];  //Spread Operator: crea un nuovo array con gli stessi elementi di books.
        } else {
            filteredBooks = filterBooksByTitle(books, searchValue);
            console.log("Filtered books:", filteredBooks);
        }

        removeAllBooks();
        filteredBooks.forEach(book => {
            loadSingleBook(book);
        });
    });

    resetButton.addEventListener("click", () => {
        removeAllBooks();
        books.forEach(book => {
            loadSingleBook(book);
        });
    });
});


function getSearchBarValue() {
    const searchBar = document.getElementById("searchInput");

    return searchBar.value;
}

function removeAllBooks() {
    const listContainer = document.getElementById("bookList");

    while (listContainer.firstChild) {
        listContainer.removeChild(listContainer.firstChild);
    }
}

function filterBooksByTitle(books, searchValue) {
    let searchValueLower = searchValue.toLowerCase();

    return books.filter((book) => {
        let title = book.title.toLowerCase();
        let category = book.category.name.toLowerCase(); 
        let author = book.author.name.toLowerCase(); 
        let authorSurname = book.author.surname.toLowerCase(); 

        return title.includes(searchValueLower) || category.includes(searchValueLower)|| author.includes(searchValueLower) || authorSurname.includes(searchValueLower);
    });
}

