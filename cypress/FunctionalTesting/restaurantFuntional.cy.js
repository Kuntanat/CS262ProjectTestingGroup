describe('Restaurant Helper Functional Tests', () => {
  const baseUrl =
    'https://cs262-tu-restauranthelper-bqa4f9dva8b7g7bk.southeastasia-01.azurewebsites.net/'

  beforeEach(() => {
    cy.visit(baseUrl);

    cy.contains('กลับบ้าน').should('be.visible');
    cy.contains('ทานที่ร้าน').should('be.visible');
  })

  it('TC_F01 เลือกประเภทบริการ', () => {
    cy.contains('ทานที่ร้าน').should('be.visible').click()

    cy.contains('Enjoy Your Meal').should('be.visible')
  })

  it('TC_F05 ค้นหาชื่ออาหาร', () => {
    cy.contains('ทานที่ร้าน').click()

    cy.contains('สั่งอาหาร').click()

    cy.get('input[placeholder*="ค้นหา"], input[placeholder*="Search"], input[type="text"]')
      .first()
      .should('be.visible')
      .type('กะเพรา')

    cy.contains('กะเพรา').should('exist')
  })

it('TC_F08 ราคารวมพื้นฐาน', () => {
  cy.visit(baseUrl);
  
  cy.contains('ทานที่ร้าน').click();
  cy.contains('สั่งอาหาร').click({ force: true });

  // สั่งรายการที่ 1
  cy.get('.menu-item').eq(0).find('.add-btn').click({ force: true });
  
  // *** จุดสำคัญ: รอให้ฟังก์ชันในหน้า Detail พร้อมก่อนกด ***
  cy.window().its('addToCart', { timeout: 10000 }).should('be.a', 'function');
  cy.get('#confirmBtn').click({ force: true });

  // กลับมาหน้าเมนู แล้วสั่งรายการที่ 2
  cy.get('.menu-item').eq(1).find('.add-btn').click({ force: true });
  cy.window().its('addToCart', { timeout: 10000 }).should('be.a', 'function');
  cy.get('#confirmBtn').click({ force: true });

  // ไปหน้าตะกร้า
  cy.get('.cart-icon img').click({ force: true });

  // ตรวจสอบราคา
  cy.get('#grand-total', { timeout: 10000 })
    .should('be.visible')
    .and('not.contain', '0');
});

it('TC_F13 ยืนยันการส่งอาหาร', () => {
  cy.visit(baseUrl);
  
  cy.contains('ทานที่ร้าน').click();
  cy.contains('สั่งอาหาร').click({ force: true });
  cy.get('.menu-item').eq(3).find('.add-btn').click({ force: true });
  
  // *** จุดสำคัญ: รอให้ฟังก์ชันในหน้า Detail พร้อมก่อนกด ***
  cy.window().its('addToCart', { timeout: 10000 }).should('be.a', 'function');
  cy.get('#confirmBtn').click({ force: true });

  // ไปหน้าตะกร้า
  cy.get('.cart-icon img').click({ force: true });

  // 1. กดโดยระบุ Class (วิธีที่แม่นยำที่สุด)
cy.get('button.confirm-btn').click({ force: true });

// 2. หรือกดโดยหาจากข้อความบนปุ่ม (เผื่อกรณีมีหลายปุ่ม)
cy.contains('button', 'ยืนยันคำสั่งซื้อ').click({ force: true });

cy.url({ timeout: 10000 }).should('include', 'received.html');
cy.get('.wrapper h1').should('contain', 'ได้รับรายการ');
cy.get('.wrapper button').contains('ยืนยัน').click({ force: true });
cy.url().should('include', 'menu.html');
})
})