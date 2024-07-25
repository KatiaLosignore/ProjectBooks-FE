
class CategoryService {
    constructor() {
        this.basePath = "https://localhost:7173/api/Category";
    }

    async getCategoryById(categoryId) {
        try {
            const response = await fetch(`${this.basePath}/${categoryId}`);
            if (!response.ok) {
                throw new Error(`Errore HTTP: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Errore durante il recupero della categoria:", error);
            return null;
        }
    }

    async aggiornaCategoria(categoryId, datiCategoria) {
        const payload = {
            name: datiCategoria.name,
        };

        try {
            const response = await fetch(`${this.basePath}/${categoryId}`, {
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
            console.error("Errore nell'aggiornamento della categoria:", err);
            return null;
        }
    }
}




async function caricaDettagliCategoria(categoryId) {
    const servizioCategoria = new CategoryService();
    const categoria = await servizioCategoria.getCategoryById(categoryId);
    if (categoria) {
        document.getElementById("name").value = categoria.name;
    } else {
        console.error("Impossibile caricare i dettagli della categoria.");
    }
}

function gestisciAggiornamentoForm(event, categoryId) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const datiCategoria = Object.fromEntries(formData.entries());

    const servizioCategoria = new CategoryService();
    servizioCategoria.aggiornaCategoria(categoryId, datiCategoria)
        .then(status => {
            if (status === 200) {
                console.log('Categoria aggiornata con successo.');
                alert('Categoria aggiornata con successo.');
            } else {
                console.error('Errore nell\'aggiornamento della categoria.');
                alert('Errore nell\'aggiornamento della categoria.');
            }
        })
        .catch(errore => {
            console.error('Errore nell\'aggiornamento della categoria:', errore);
            alert('Errore nell\'aggiornamento della categoria.');
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    console.log("Parametri dell'URL:", window.location.search); // Mostra tutti i parametri dell'URL
    const categoryId = urlParams.get('categoryId');
    console.log("ID della categoria:", categoryId); // Messaggio di debug


    if (categoryId) {
        caricaDettagliCategoria(categoryId);
        
        const form = document.getElementById('form');
        if (form) {
            form.addEventListener('submit', (event) => gestisciAggiornamentoForm(event, categoryId));
        } else {
            console.error("Elemento 'form' non trovato nell'HTML.");
        }
    } else {
        console.error("ID della categoria non specificato.");
    }
});




