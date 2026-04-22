package com.cs262.IntegrationTest;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.util.HashMap;
import java.util.Map;

public class PromoIntegrationTest {

    private Map<String, Double> fakePromoDb;

    @BeforeEach
    void setUp() {
        
        fakePromoDb = new HashMap<>();
        fakePromoDb.put("Discount10%", 0.10);
        fakePromoDb.put("Discount20%", 0.20);
    }

    @Test
    void TC_I03_CalculateDiscount_Success() {

        double totalPrice = 500.0;
        String code = "Discount10%";
        
        double discountPercent = fakePromoDb.getOrDefault(code, 0.0);
        double finalPrice = totalPrice - (totalPrice * discountPercent);

        assertEquals(450.0, finalPrice, "final price must be 450");
    }
    
    @Test
    void TC_I05_CalculateDiscount_InvalidCode_ShouldReturnFullPrice() {
        double totalPrice = 500.0;
        String invalidCode = "โปรมั่วซั่ว99"; 
        
        double discountPercent = fakePromoDb.getOrDefault(invalidCode, 0.0);
        double finalPrice = totalPrice - (totalPrice * discountPercent);

        assertEquals(500.0, finalPrice, "ถ้าโค้ดผิด ต้องจ่ายราคาเต็ม 500");
    }
}
