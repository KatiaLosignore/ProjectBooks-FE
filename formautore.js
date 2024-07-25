class AuthorService {
    basePath = "https://localhost:7173/api/Author";
  
    async getAuthors() {
        try {
            const response = await fetch(this.basePath);
            if (!response.ok) {
                throw new Error(`Errore HTTP: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Errore durante l'inserimento dell\' autore:", error);
            return [];
        }
    }

    async aggiungiAutore(datiAutore) {
        console.log("Dati inviati 1:", datiAutore); // Log dei dati inviati
        
        const payload = {
            name: datiAutore.name,
            surname: datiAutore.surname,
            address: datiAutore.address,
            city: datiAutore.city,
        };
        console.log("Dati inviati:", payload); // Log dei dati inviati
        try {
            const response = await fetch(this.basePath, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            // const responseBody = await response.text(); // Legge il corpo della risposta come testo
            console.log("Risposta dal server:", response.status, response.statusText); // Log dei dati della risposta

            if (!response.ok) {
                throw new Error(`Errore HTTP: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (err) {
            console.error("Error adding author:", err);
            return null;
        }
    }
}

function gestisciInvioForm(event) {
    event.preventDefault(); // Impedisci l'invio standard del form
    const form = event.target;
    const formData = new FormData(form);
    const datiAutore = Object.fromEntries(formData.entries());

    console.log("Dati dal form:", datiAutore);

    if (!datiAutore.name) {
        console.error("Il campo 'name' è vuoto.");
        return;
    }
    if (!datiAutore.surname) {
        console.error("Il campo 'surname' è vuoto.");
        return;
    }
    if (!datiAutore.address) {
        console.error("Il campo 'address' è vuoto.");
        return;
    }
    if (!datiAutore.city) {
        console.error("Il campo 'city' è vuoto.");
        return;
    }
  
    const servizioAutore = new AuthorService();
    servizioAutore.aggiungiAutore(datiAutore)
    .then(nuovaAutore => {
        console.log('Autore aggiunta:', nuovaAutore);
        form.reset();
    })
    .catch(errore => console.error('Errore nell\'aggiunta dell\' autore:', errore));
}

document.addEventListener('DOMContentLoaded', () => {
  
    const form = document.getElementById('form'); // Prendo l'ID del form 
    if (form) {
        form.addEventListener('submit', gestisciInvioForm);
    } else {
        console.error("Elemento 'form' non trovato nell'HTML.");
    }
});

  