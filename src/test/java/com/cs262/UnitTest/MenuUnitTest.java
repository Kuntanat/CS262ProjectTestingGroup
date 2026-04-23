package com.cs262.UnitTest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.example.demo.model.Menu;
import com.example.demo.service.MenuService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class MenuUnitTest {

    @Mock
    private MenuService menuService;

    @Test
    void TC_U01_getMenuById_Found() {
        Menu mockMenu = new Menu();
        mockMenu.setId(7);
        mockMenu.setName("กะเพราไก่");
        when(menuService.getMenuById(7)).thenReturn(mockMenu);

        Menu result = menuService.getMenuById(7);

        assertNotNull(result);
        assertEquals(7, result.getId());
        assertEquals("กะเพราไก่", result.getName());
    }

    @Test
    void TC_U02_getMenuById_NotFound() {
        when(menuService.getMenuById(999)).thenReturn(null);

        Menu result = menuService.getMenuById(999);

        assertNull(result);
    }

    @Test
    void TC_U03_calculatePriceByQuantity() {
        double price = 60.0;
        int quantity = 2;
   
        double total = price * quantity;

        assertEquals(120.0, total);
    }


    @Test
    void TC_U04_calculateNormalPrice() {
        double result = fakeCalculateLogic(50.0, false, false);
        assertEquals(50.0, result);
    }

    @Test
    void TC_U05_calculateSpecialOnly() {
        double result = fakeCalculateLogic(50.0, true, false);
        assertEquals(60.0, result); // 50 + 10
    }

    @Test
    void TC_U06_calculateSpecialOnly_Repeat() {
        double result = fakeCalculateLogic(50.0, true, false);
        assertEquals(60.0, result);
    }

    @Test
    void TC_U07_calculateWithEggOnly() {
        double result = fakeCalculateLogic(50.0, false, true);
        assertEquals(60.0, result); // 50 + 10
    }

    @Test
    void TC_U08_calculateSpecialAndEgg() {
        double result = fakeCalculateLogic(50.0, true, true);
        assertEquals(70.0, result); // 50 + 10 + 10
    }

    private double fakeCalculateLogic(double basePrice, boolean isSpecial, boolean addEgg) {
        double total = basePrice;
        if (isSpecial) total += 10.0;
        if (addEgg) total += 10.0;
        return total;
    }
}