async function loadBestSellers() {
  try {
    const API_BASE_URL = "https://cs262-tu-restauranthelper-bqa4f9dva8b7g7bk.southeastasia-01.azurewebsites.net";
    const res1 = await fetch(`${API_BASE_URL}/api/best-seller`);
    const bestSellers = await res1.json();

    if (!Array.isArray(bestSellers) || bestSellers.length === 0) return;

    const res2 = await fetch(`${API_BASE_URL}/api/menu`);
    const menus = await res2.json();

    const menuMap = {};
    menus.forEach(m => {
      menuMap[m.id] = m;
    });

    const container = document.getElementById("best-sellers-list");
    container.innerHTML = "";

    const top3 = bestSellers.sort((a,b) => b.totalSales - a.totalSales).slice(0,3);

    top3.forEach(bs => {
      const menu = menuMap[bs.menuId];
      if (!menu) return;

	  const item = document.createElement("div");
	  item.className = "menu-item";
	  item.dataset.id = menu.id;               
	  item.dataset.categoryid = menu.categoryId; 
	  item.innerHTML = `
	    <div class="image-box">
	      <img src="${menu.image}" alt="${menu.name}">
	    </div>
	    <div class="menu-info">
	      <p>${menu.name}</p>
	      <a href="#" class="arrow-link">➜</a>
	    </div>
	  `;
	  container.appendChild(item);
    });

  } catch (err) {
    console.error("Error loading best sellers:", err);
  }
  const container = document.getElementById("best-sellers-list");
  container.addEventListener("click", (event) => {
    const menuItem = event.target.closest(".menu-item");
    if (!menuItem) return;

    if (event.target.classList.contains("arrow-link")) {
      event.preventDefault();
      const id = menuItem.dataset.id;
      const categoryId = parseInt(menuItem.dataset.categoryid, 10);

      let detailPage = "Detail.html"; 
      if (categoryId === 2) detailPage = "beveragedetail.html";
      else if (categoryId === 3) detailPage = "dessertdetail.html";

      if (id) {
        window.location.href = `${detailPage}?id=${id}`;
      }
    }
  });

}

loadBestSellers();
