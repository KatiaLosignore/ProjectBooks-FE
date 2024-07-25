
class AuthorService {
    constructor() {
        this.basePath = "https://localhost:7173/api/Author";
    }

    async getAuthorById(authorId) {
        try {
            const response = await fetch(`${this.basePath}/${authorId}`);
            if (!response.ok) {
                throw new Error(`Errore HTTP: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Errore durante il recupero dell' autore:", error);
            return null;
        }
    }

    async aggiornaAutore(authorId, datiAutore) {
        const payload = {
            name: datiAutore.name,
            surname: datiAutore.surname,
            address: datiAutore.address,
            city: datiAutore.city,

        };

        try {
            const response = await fetch(`${this.basePath}/${authorId}`, {
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
            console.error("Errore nell'aggiornamento dell' autore:", err);
            return null;
        }
    }
}




async function caricaDettagliAutore(authorId) {
    const servizioAutore = new AuthorService();
    const autore = await servizioAutore.getAuthorById(authorId);
    if (autore) {
        document.getElementById("name").value = autore.name;
        document.getElementById("surname").value = autore.surname;
        document.getElementById("address").value = autore.address;
        document.getElementById("city").value = autore.city;
    } else {
        console.error("Impossibile caricare i dettagli dell' autore.");
    }
}

function gestisciAggiornamentoForm(event, authorId) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const datiAutore = Object.fromEntries(formData.entries());

    const servizioAutore = new AuthorService();
    servizioAutore.aggiornaAutore(authorId, datiAutore)
        .then(status => {
            if (status === 200) {
                console.log('Autore aggiornato con successo.');
                alert('Autore aggiornato con successo.');
            } else {
                console.error('Errore nell\'aggiornamento dell\'autore.');
                alert('Errore nell\'aggiornamento dell\'autore.');
            }
        })
        .catch(errore => {
            console.error('Errore nell\'aggiornamento dell\'autore:', errore);
            alert('Errore nell\'aggiornamento dell\'autore.');
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    console.log("Parametri dell'URL:", window.location.search); // Mostra tutti i parametri dell'URL
    const authorId = urlParams.get('authorId');
    console.log("ID dell\' autore:", authorId); // Messaggio di debug


    if (authorId) {
        caricaDettagliAutore(authorId);
        
        const form = document.getElementById('form');
        if (form) {
            form.addEventListener('submit', (event) => gestisciAggiornamentoForm(event, authorId));
        } else {
            console.error("Elemento 'form' non trovato nell'HTML.");
        }
    } else {
        console.error("ID dell\' autore non specificato.");
    }
});




