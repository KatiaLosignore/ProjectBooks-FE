class AuthorService {
    basePath = "https://localhost:7173/api/Author";
    
    async getAuthors() {
        return fetch(this.basePath)
            .then(r => r.json());
    }

   
   
}
async function loadAllAuthors() {
    const authorService = new AuthorService();
    try {
        const author = await authorService.getAuthors();
        console.log(author);
        author.forEach(author => {
            loadSingleAuthor(author);
        });
    } catch (error) {
        console.error("Error loading author:", error);
    }


}
async function deleteAuthor(id) {
    return fetch("https://localhost:7173/api/Author" + "/" + id, {
        method: 'DELETE'
    }).then(() => {
        return true; 
    }).catch(err => {
        console.error(err);
        return false; 
    });
}
function loadSingleAuthor(author) {
    const listcontainer = document.getElementById("authorList");
    const authorElement = document.createElement('div');
 
    authorElement.innerHTML = `
    
        <div class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 ">
   <div class="flex flex-col items-center pb-10">
       <img class="w-24 h-24 mb-3 rounded-full shadow-lg" src="Immagine 2024-07-23 115456.png" alt="Bonnie image"/>
       <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">${author.name} ${author.surname}</h5>
       <span class="text-sm text-gray-500 dark:text-gray-400">${author.address} ${author.city}</span>
       <div class="flex justify-evenly sm:gap-4 mt-6">
            <button class="btn-cat"><a href="listalibri.html">Libri</a></button>
            <button class="btnmodifica"data-id="${author.id}"><a href="updateauthor.html?authorId=${author.id}">Modifica</a></button>
            <button class="btnelimina"data-id="${author.id}">Elimina</button>
        </div>
    </div>
    </div>

    `;
    const deleteButton = authorElement.querySelector('.btnelimina');
  
    deleteButton.addEventListener('click', async () => {
        const deleted = await deleteAuthor(author.id);
        if (deleted) {   
            authorElement.remove();
        }
    });
    
    listcontainer.appendChild(authorElement);
    
}
loadAllAuthors();
