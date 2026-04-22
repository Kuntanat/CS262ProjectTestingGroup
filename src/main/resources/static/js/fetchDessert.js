const menuList = document.querySelector('.menu-list');

fetch('https://cs262-tu-restauranthelper-bqa4f9dva8b7g7bk.southeastasia-01.azurewebsites.net/api/menu')
  .then(res => res.json())
  .then(data => {
    const desserts = data.filter(item => item.categoryId === 3); // category_id = 3

    menuList.innerHTML = ''; // เคลียร์ก่อน

    desserts.forEach(item => {
      const div = document.createElement('div');
      div.classList.add('menu-item');
      div.dataset.id = item.id;
	  
      div.innerHTML = `
        <div class="image-box">
          <img src="${item.image}" alt="${item.name}">
          <div class="add-btn" data-action="add">+</div>
        </div>
        <p>${item.name}</p>
        <p class="price">${item.price} บาท</p>
      `;

      menuList.appendChild(div);
    });

    console.log('✅ Loaded dessert menu:', desserts.length);
  })
  .catch(err => console.error('❌ Fetch error:', err));
