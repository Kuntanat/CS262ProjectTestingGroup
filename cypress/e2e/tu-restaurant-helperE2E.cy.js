describe('Restaurant Helper E2E', () => {
  const baseUrl =
    'https://cs262-tu-restauranthelper-bqa4f9dva8b7g7bk.southeastasia-01.azurewebsites.net/';

  beforeEach(() => {
    // เข้าเว็บหน้าแรก
    cy.visit(baseUrl);

    // ตรวจสอบว่าปุ่มหลักในหน้าแรกแสดงถูกต้อง
    cy.contains('กลับบ้าน').should('be.visible');
    cy.contains('ทานที่ร้าน').should('be.visible');
  });

  it('TC_E01 - เส้นทางผู้ใช้งานของผู้ที่ต้องการสั่งอาหาร', () => {
    // 1: เข้าหน้าแรกของเว็บพร้อมเลือกสั่งแบบทานที่ร้านและกดเมนูสั่งอาหาร
    cy.contains('ทานที่ร้าน').click();
    cy.url().should('include', '/discover.html');

    cy.contains('สั่งอาหาร').click({ force: true });
    cy.url().should('include', '/menu.html');

    // 2: ใช้ช่อง Search หาคำว่า "กะเพรา"
    cy.get('input[placeholder="ค้นหาเมนู..."]', { timeout: 10000 })
      .should('be.visible')
      .clear()
      .type('กะเพรา');

    // 3: กดเลือกเมนู "กะเพราไก่" เพื่อดูรายละเอียด
    cy.contains('.menu-item p', 'ผัดกะเพราไก่', { timeout: 10000 })
      .should('be.visible')
      .parents('.menu-item')
      .within(() => {
        cy.get('.add-btn').click({ force: true });
      });

    cy.url({ timeout: 10000 }).should('include', 'Detail.html?id=');
    cy.get('#item-title').should('contain.text', 'กะเพรา');

    // 4: กดปรับเป็นพิเศษ
    cy.contains('พิเศษ', { timeout: 10000 }).click({ force: true });

    // 5: กดเพิ่มไข่ดาว 1 ฟอง
    cy.contains('ไข่ดาว')
      .parents('.line')
      .within(() => {
        cy.get('button[data-d="1"]').click({ force: true });
      });

    // 6: กดเพิ่ม "กะเพราไก่" 2 จาน
    cy.get('#mainPlus').click({ force: true });
    cy.get('#mainQty').should('contain.text', '2');

    // รอให้ฟังก์ชัน addToCart พร้อมก่อนกดยืนยัน
    cy.window().its('addToCart', { timeout: 10000 }).should('be.a', 'function');

    // เพิ่มสินค้าลงตะกร้า
    cy.get('#confirmBtn').click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/menu.html');

    // เข้าหน้าตะกร้าผ่านไอคอนรถเข็น
    cy.get('.cart-icon img').click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/Summary.html');

    // เข้าหน้าเลือกคูปอง
    cy.contains('เลือกคูปอง').click({ force: true });
    cy.url({ timeout: 10000 }).should('include', 'MyCoupon.html');

    // 7: กดใช้โปรโมชั่น "ส่วนลด 10%"
    // ไปหน้าเก็บส่วนลด
    cy.contains('ไปยังหน้าเก็บส่วนลด').click({ force: true });
    cy.url({ timeout: 10000 }).should('include', 'promotion.html');

    // กดเก็บคูปอง 10%
    cy.contains('.promo-text', 'ส่วนลด 10% ขั้นต่ำ 100')
      .parents('.promo-item')
      .within(() => {
        cy.get('.claim-btn').click({ force: true });
        cy.get('.claim-btn').should('contain.text', 'เก็บแล้ว');
      });

    // กลับไปหน้าโค้ดของคุณ
    cy.go('back');
    cy.url({ timeout: 10000 }).should('include', 'MyCoupon.html');

    // กดใช้คูปอง 10%
    cy.contains('.coupon-text', 'ส่วนลด 10% ขั้นต่ำ 100')
      .parents('.coupon-item')
      .within(() => {
        cy.get('.use-btn').click({ force: true });
        cy.get('.use-btn').should('contain.text', 'ใช้แล้ว');
      });

    // กลับไปหน้าตะกร้า
    cy.get('.back').click({ force: true });
    cy.url({ timeout: 10000 }).should('include', 'Summary.html');

    // 8: ตรวจสอบยอดรวมสุดท้ายในตะกร้า
    cy.contains('ตะกร้าของคุณ').should('be.visible');
    cy.contains(/ผัดกะเพราไก่|กะเพรา/i).should('be.visible');
    cy.contains('จำนวน:').should('be.visible');
    cy.get('#grand-total').should('be.visible');

    // ตรวจว่ามีการใช้ส่วนลดแล้ว
    cy.get('#grand-total')
      .invoke('text')
      .should('include', 'ลดแล้ว');

    // 9: กดยืนยันคำสั่งซื้อ
    cy.get('.confirm-btn').click({ force: true });

    // ตรวจว่าไปหน้ารับรายการสำเร็จ
    cy.url({ timeout: 10000 }).should('include', 'received.html');
  });


  it('TC_E02 - เส้นทางผู้ใช้งานของผู้ที่ต้องการสั่งอาหารแต่เปลี่ยนใจไม่สั่ง', () => {
    // 1: เข้าหน้าแรกของเว็บพร้อมเลือกสั่งแบบกลับบ้านและกดเมนูสั่งอาหาร
    cy.contains('กลับบ้าน').click();
    cy.url().should('include', '/discover.html');

    cy.contains('สั่งอาหาร').click({ force: true });
    cy.url().should('include', '/menu.html');

    // 2: ใช้ช่อง Search หาคำว่า "พิซซ่า"
    cy.get('input[placeholder="ค้นหาเมนู..."]', { timeout: 10000 })
      .should('be.visible')
      .clear()
      .type('พิซซ่า')
      .should('have.value', 'พิซซ่า');

    // 3: ไม่พบเมนูที่ต้องการ
    cy.contains('ไม่พบเมนูที่ค้นหา', { timeout: 10000 }).should('be.visible');

    // 4: ย้อนกลับมาหน้าหลัก
    cy.go('back');
    cy.url({ timeout: 10000 }).should('include', '/discover.html');

    // 5: เลือกเมนูแรกใน Best Sellers
    cy.contains(/Best Sellers|Best sellers/i).should('be.visible');
    cy.get('#best-sellers-list .menu-item', { timeout: 10000 })
      .first()
      .within(() => {
        cy.get('.arrow-link').click({ force: true });
      });

    // 6: กดเพิ่มไป 1 จาน
    cy.url({ timeout: 10000 }).should('include', 'Detail.html?id=');
    cy.get('#mainQty').should('contain.text', '1');

    cy.window().its('addToCart', { timeout: 10000 }).should('be.a', 'function');
    cy.get('#confirmBtn').click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/menu.html');

    // เข้าตะกร้าผ่านไอคอนรถเข็น
    cy.get('.cart-icon img').click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/Summary.html');

    // 7: ตรวจสอบยอดรวมสุดท้ายในตะกร้า
    cy.contains('ตะกร้าของคุณ').should('be.visible');
    cy.get('#grand-total').should('be.visible');
    cy.get('#grand-total').invoke('text').should('not.be.empty');

    // 8: กดลบรายการที่จะสั่งออก
    cy.get('.delete-btn', { timeout: 10000 }).first().click({ force: true });

    // ตรวจว่าตะกร้ากลายเป็น 0 บาท และไม่มีรายการแล้ว
    cy.contains('ยังไม่มีรายการในตะกร้า', { timeout: 10000 }).should('be.visible');
    cy.get('#grand-total').should('contain.text', '0');
  });
});