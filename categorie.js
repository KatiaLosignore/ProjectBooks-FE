class CategoryService {
    basePath = "https://localhost:7173/api/Category";
    
    async getCategories() {
        return fetch(this.basePath)
            .then(r => r.json());
    }

   
   
}
async function loadAllCategories() {
    const categoryService = new CategoryService();
    try {
        const categories = await categoryService.getCategories();
        console.log(categories);
        categories.forEach(category => {
            loadSingleCategory(category);
        });
    } catch (error) {
        console.error("Error loading category:", error);
    }


}
async function deleteCategory(id) {
    return fetch("https://localhost:7173/api/Category" + "/" + id, {
        method: 'DELETE'
    }).then(() => {
        return true; 
    }).catch(err => {
        console.error(err);
        return false; 
    });
}
function loadSingleCategory(category) {
    const listcontainer = document.getElementById("categoryList");
    const categoryElement = document.createElement('div');
 
    categoryElement.innerHTML = `
        <div class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl  dark:border-gray-700 dark:bg-gray-800">
            <div class="flex flex-col justify-between p-4 leading-normal">
                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${category.name}</h5>
                <div class="flex justify-between sm:gap-4">

                    <button class="btn-cat"><a href="listalibri.html">Libri</a></button>
                    <button class="btnmodifica"data-id="${category.id}"><a href="updatecategoria.html?categoryId=${category.id}">Modifica</a></button>
                    <button class="btnelimina"data-id="${category.id}">Elimina</button>

                </div>
            </div>
        </div>
    `;
    const deleteButton = categoryElement.querySelector('.btnelimina');
  
    deleteButton.addEventListener('click', async () => {
        const deleted = await deleteCategory(category.id);
        if (deleted) {   
            categoryElement.remove();
        }
    });
    
    listcontainer.appendChild(categoryElement);
    
}
loadAllCategories();
