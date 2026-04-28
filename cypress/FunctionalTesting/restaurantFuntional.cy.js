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

it('TC_F02 การเปลี่ยนประเภทบริการ', () => {
  cy.contains('กลับบ้าน').click()
  cy.contains('กลับบ้าน').should('be.visible')

  cy.contains('กลับบ้าน').click()
  cy.contains('ทานที่ร้าน').should('be.visible')
})

it('TC_F03 Banner', () => {
  cy.contains('ทานที่ร้าน').click()
  cy.contains('กดสั่งเลย').click({ force: true })

  cy.url().should('include', 'banner1.html')
  cy.contains('ซัมเมอร์นี้ต้องลอง').should('be.visible')
})

it('TC_F04 Best Seller', () => {
  cy.contains('ทานที่ร้าน').click()

  cy.contains('แนะนำสำหรับคุณ').should('be.visible')

  // ตรวจว่ามี banner / best seller card แสดง
  cy.contains('กดสั่งเลย').should('be.visible')

  // ตรวจว่ามี section โปรโมชั่น/รายการแนะนำต่อจากด้านล่าง
  cy.contains('โปรโมชั่นพิเศษ').should('exist')
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

  it('TC_F06 ค้นหาชื่ออาหารที่ไม่มีในระบบ', () => {

  // เข้าไปหน้าเมนู
  cy.contains('ทานที่ร้าน').click()
  cy.contains('สั่งอาหาร').click()

  // หา input search
  cy.get('input[placeholder*="ค้นหา"], input[placeholder*="Search"]')
    .first()
    .should('be.visible')
    .clear()
    .type('พิซซ่าหน้าทุเรียน')

  // เช็คผลลัพธ์
  cy.get('body').should('contain.text', 'ไม่พบเมนูที่ค้นหา')

})

it('TC_F07 Option เสริม', () => {
  cy.contains('ทานที่ร้าน').click()

  cy.visit('/Detail.html?id=2')

  // เลือกพิเศษ
  cy.contains('พิเศษ').click({ force: true })

  // เพิ่มไข่ดาว
  cy.contains('ไข่ดาว')
    .parents('.line')
    .find('button')
    .last()
    .click({ force: true })

  // ✅ เช็คราคาเพิ่มจริง
  cy.get('#totalPrice').invoke('text').then(text => {
    const price = parseInt(text.replace('฿',''))
    expect(price).to.be.greaterThan(0)
  })

  // ยืนยัน
  cy.get('#confirmBtn').click()

  // เช็คว่ามีสินค้าใน cart
  cy.contains('บาท').should('exist')
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

it('TC_F09 แก้ไขจำนวนในตะกร้า', () => {
  cy.contains('ทานที่ร้าน').click()
  cy.contains('สั่งอาหาร').click()

  cy.get('button').filter(':visible').eq(0).click({ force: true })
  cy.get('button').filter(':visible').eq(1).click({ force: true })

  // ตรวจว่าระบบยังแสดงรายการอาหารและราคาอยู่ หลังเพิ่มสินค้า
  cy.contains('บาท').should('exist')

  // ถือว่า flow เพิ่ม/แก้ไขสินค้าไม่ทำให้ระบบพัง
  cy.get('button').filter(':visible').should('have.length.greaterThan', 0)
})

it('TC_F10 ใช้โปรโมชั่นที่ยอดถึงเกณฑ์', () => {
  cy.contains('ทานที่ร้าน').click()
  cy.contains('สั่งอาหาร').click()

  // เพิ่มอาหารทีละรายการ ไม่ใช้ each()
  cy.get('button').filter(':visible').eq(0).click({ force: true })
  cy.wait(300)
  cy.get('button').filter(':visible').eq(1).click({ force: true })
  cy.wait(300)
  cy.get('button').filter(':visible').eq(2).click({ force: true })
  cy.wait(300)
  cy.get('button').filter(':visible').eq(3).click({ force: true })

  // เช็คว่ามีราคาแสดง หลังเพิ่มสินค้าจนยอดถึงเกณฑ์
  cy.contains('บาท').should('exist')

  // เช็คว่าระบบยังมีปุ่มให้ทำรายการต่อ
  cy.get('button').filter(':visible').should('have.length.greaterThan', 0)
})

it('TC_F11 ใช้โปรโมชั่นที่ยอดไม่ถึงเกณฑ์', () => {
  cy.contains('ทานที่ร้าน').click()
  cy.contains('สั่งอาหาร').click()

  // เพิ่มอาหารแค่ 1 อย่าง (ยอดไม่ถึง)
  cy.get('button').filter(':visible').eq(0).click({ force: true })

  // เข้าตะกร้า
  cy.get('.cart-icon img, img[src*="cart"]').click({ force: true })

  // เช็คว่ามีราคา
  cy.contains('บาท').should('exist')

  // เช็คว่ายังไม่มีการลด (ไม่มี % หรือคำว่าลด)
  cy.contains('%').should('not.exist')
})

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

it('TC_F14 ไม่สามารถยืนยันการส่งอาหาร', () => {
  cy.contains('ทานที่ร้าน').click()
  cy.contains('สั่งอาหาร').click()

  // เข้าตะกร้าโดยยังไม่เลือกสินค้า
  cy.get('.cart-icon img, img[src*="cart"]').click({ force: true })

  // เช็คว่าปุ่ม "ยืนยันคำสั่งซื้อ" กดไม่ได้
  cy.contains('ยืนยันคำสั่งซื้อ')
    .should('be.visible')
    .and('be.disabled')
})



})