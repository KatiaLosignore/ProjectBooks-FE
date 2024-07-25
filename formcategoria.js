class CategoryService {
    basePath = "https://localhost:7173/api/Category";
  
    async getCategories() {
        try {
            const response = await fetch(this.basePath);
            if (!response.ok) {
                throw new Error(`Errore HTTP: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Errore durante l'inserimento della categoria:", error);
            return [];
        }
    }

    async aggiungiCategoria(datiCategoria) {
        console.log("Dati inviati 1:", datiCategoria); // Log dei dati inviati
        
        const payload = {
            name: datiCategoria.name,
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

            const responseBody = await response.text(); // Legge il corpo della risposta come testo
            console.log("Risposta dal server:", response.status, response.statusText, responseBody); // Log dei dati della risposta

            if (!response.ok) {
                throw new Error(`Errore HTTP: ${response.status} ${response.statusText} - ${responseBody}`);
            }

            return await response.json();
        } catch (err) {
            console.error("Error adding book:", err);
            return null;
        }
    }
}




function gestisciInvioForm(event) {
    event.preventDefault(); // Impedisci l'invio standard del form
    const form = event.target;
    const formData = new FormData(form);
    const datiCategoria = Object.fromEntries(formData.entries());

    console.log("Dati dal form:", datiCategoria);

    if (!datiCategoria.name) {
        console.error("Il campo 'name' è vuoto.");
        return;
    }
  
    const servizioCategoria = new CategoryService();
    servizioCategoria.aggiungiCategoria(datiCategoria)
    .then(nuovaCategoria => {
        console.log('Categoria aggiunta:', nuovaCategoria);
        form.reset();
    })
    .catch(errore => console.error('Errore nell\'aggiunta della Categoria:', errore));
}

document.addEventListener('DOMContentLoaded', () => {
  
    const form = document.getElementById('form'); // Prendo l'ID del form 
    if (form) {
        form.addEventListener('submit', gestisciInvioForm);
    } else {
        console.error("Elemento 'form' non trovato nell'HTML.");
    }
});

  