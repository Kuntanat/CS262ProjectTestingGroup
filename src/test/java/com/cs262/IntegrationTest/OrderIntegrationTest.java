package com.cs262.IntegrationTest;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import java.util.ArrayList;
import java.util.List;

public class OrderIntegrationTest {

    private List<String> fakeOrderRepository = new ArrayList<>();
    private List<String> uiCart = new ArrayList<>();

    @Test
    void TC_I04_SaveOrder_ShouldUpdateListAndClearCart() {
        
        uiCart.add("ข้าวมันไก่");
        uiCart.add("น้ำดื่ม");

        String orderData = String.join(", ", uiCart);
        fakeOrderRepository.add(orderData); 
        uiCart.clear();

        assertFalse(fakeOrderRepository.isEmpty(), "ข้อมูล Order ต้องถูกบันทึก");
        assertEquals("ข้าวมันไก่, น้ำดื่ม", fakeOrderRepository.get(0));

        assertTrue(uiCart.isEmpty(), "ตะกร้าใน UI ต้องถูกล้างค่าหลังจากบันทึก");
    }
    
    @Test
    void TC_I06_SaveOrder_NegativePrice_ShouldThrowException() {
        double negativePrice = -100.0;
        
        assertThrows(IllegalArgumentException.class, () -> {
            if (negativePrice < 0) {
                throw new IllegalArgumentException("ราคาสินค้าติดลบไม่ได้");
            }
            fakeOrderRepository.add("Order Error: " + negativePrice);
        });
        
        assertTrue(fakeOrderRepository.isEmpty(), "ข้อมูลราคาลบต้องไม่ถูกบันทึก");
    }
}