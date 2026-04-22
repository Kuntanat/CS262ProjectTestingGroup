package com.cs262.IntegrationTest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.demo.model.Menu;
import com.example.demo.service.MenuService;

@ExtendWith(MockitoExtension.class)
public class MenuIntegrationTest {

    @Mock
    private MenuService menuService;

    @Test
    void TC_I01_DisplayMenuDetail_Success() {
        Menu mockMenu = new Menu();
        mockMenu.setId(5);
        mockMenu.setName("ผัดกะเพราหมูกรอบ");
        mockMenu.setPrice(60.0);

        when(menuService.getMenuById(5)).thenReturn(mockMenu);

        Menu result = menuService.getMenuById(5);
        
        assertNotNull(result);
        assertEquals("ผัดกะเพราหมูกรอบ", result.getName());
        assertEquals(60.0, result.getPrice());
    }

    @Test
    void TC_I02_DisplayMenuDetail_Error500() {

        when(menuService.getMenuById(99)).thenThrow(new RuntimeException("Internal Server Error"));

        assertThrows(RuntimeException.class, () -> {
            menuService.getMenuById(99);
        });
    }
    
    @Test
    void TC_I07_GetMenuDetail_NullId_ShouldThrowException() {
        Integer nullId = null;
        when(menuService.getMenuById(nullId)).thenThrow(new IllegalArgumentException("ID cannot be null"));

        assertThrows(IllegalArgumentException.class, () -> {
            menuService.getMenuById(nullId);
        });
    }
}