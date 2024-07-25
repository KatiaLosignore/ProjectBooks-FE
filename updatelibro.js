
class BookService {
    constructor() {
        this.basePath = "https://localhost:7173/api/Book";
    }

    async getBookById(bookId) {
        try {
            const response = await fetch(`${this.basePath}/${bookId}`);
            if (!response.ok) {
                throw new Error(`Errore HTTP: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Errore durante il recupero del libro:", error);
            return null;
        }
    }

    async aggiornaLibro(bookId, datiLibro) {
        const payload = {
            title: datiLibro.title,
            description: datiLibro.description,
            year: parseInt(datiLibro.year, 10),
            categoryId: parseInt(datiLibro.category, 10),
            authorId: parseInt(datiLibro.author, 10)
        };

        try {
            const response = await fetch(`${this.basePath}/${bookId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Errore HTTP: ${response.status} ${response.statusText}`);
            }

            return response.status;
        } catch (err) {
            console.error("Errore nell'aggiornamento del libro:", err);
            return null;
        }
    }
}

class CategoryService {
    constructor() {
        this.basePath = "https://localhost:7173/api/Category";
    }

    async getCategories() {
        try {
            const response = await fetch(this.basePath);
            if (!response.ok) {
                throw new Error(`Errore HTTP: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Errore durante il recupero delle categorie:", error);
            return [];
        }
    }
}

class AuthorService {
    constructor() {
        this.basePath = "https://localhost:7173/api/Author"; // Assumiamo questo endpoint per l'API degli autori
    }

    async getAuthors() {
        try {
            const response = await fetch(this.basePath);
            if (!response.ok) {
                throw new Error(`Errore HTTP: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Errore durante il recupero degli autori:", error);
            return [];
        }
    }
}

async function loadAllCategories() {
    const categoryService = new CategoryService();
    const categories = await categoryService.getCategories();

    const selectElement = document.getElementById("category");
    if (selectElement) {
        selectElement.innerHTML = ''; // Svuota il menu a tendina

        const placeholderOption = document.createElement("option");
        placeholderOption.value = "";
        placeholderOption.text = "Seleziona una categoria";
        selectElement.appendChild(placeholderOption);

        categories.forEach(cat => {
            const optionElement = document.createElement("option");
            optionElement.value = cat.id;
            optionElement.text = cat.name;
            selectElement.appendChild(optionElement);
        });
    } else {
        console.error("Elemento 'category' non trovato nell'HTML.");
    }
}

async function loadAllAuthors() {
    const authorService = new AuthorService();
    const authors = await authorService.getAuthors();

    const selectElement = document.getElementById("author");
    if (selectElement) {
        selectElement.innerHTML = '';

        const placeholderOption = document.createElement("option");
        placeholderOption.value = "";
        placeholderOption.text = "Seleziona un autore";
        selectElement.appendChild(placeholderOption);

        authors.forEach(author => {
            const optionElement = document.createElement("option");
            optionElement.value = author.id;
            optionElement.text = author.name + "  " + author.surname;
            selectElement.appendChild(optionElement);
        });
    } else {
        console.error("Elemento 'author' non trovato nell'HTML.");
    }
}

async function caricaDettagliLibro(bookId) {
    const servizioLibri = new BookService();
    const libro = await servizioLibri.getBookById(bookId);
    if (libro) {
        document.getElementById("title").value = libro.title;
        document.getElementById("description").value = libro.description;
        document.getElementById("year").value = libro.year;
        document.getElementById("category").value = libro.categoryId;
        document.getElementById("author").value = libro.authorId;
    } else {
        console.error("Impossibile caricare i dettagli del libro.");
    }
}

function gestisciAggiornamentoForm(event, bookId) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const datiLibro = Object.fromEntries(formData.entries());

    const servizioLibri = new BookService();
    servizioLibri.aggiornaLibro(bookId, datiLibro)
        .then(status => {
            if (status === 200) {
                console.log('Libro aggiornato con successo.');
                alert('Libro aggiornato con successo.');
            } else {
                console.error('Errore nell\'aggiornamento del libro.');
                alert('Errore nell\'aggiornamento del libro.');
            }
        })
        .catch(errore => {
            console.error('Errore nell\'aggiornamento del libro:', errore);
            alert('Errore nell\'aggiornamento del libro.');
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    console.log("Parametri dell'URL:", window.location.search); // Mostra tutti i parametri dell'URL
    const bookId = urlParams.get('bookId');
    console.log("ID del libro:", bookId); // Messaggio di debug

    loadAllCategories();
    loadAllAuthors();

    if (bookId) {
        caricaDettagliLibro(bookId);
        
        const form = document.getElementById('form');
        if (form) {
            form.addEventListener('submit', (event) => gestisciAggiornamentoForm(event, bookId));
        } else {
            console.error("Elemento 'form' non trovato nell'HTML.");
        }
    } else {
        console.error("ID del libro non specificato.");
    }
});




