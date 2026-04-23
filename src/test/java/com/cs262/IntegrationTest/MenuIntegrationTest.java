package com.cs262.IntegrationTest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import com.example.demo.model.Menu;
import com.example.demo.repo.MenuRepository;
import com.example.demo.controller.MenuController;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class MenuIntegrationTest {

    @Mock
    private MenuRepository repo; // <--- 2. ต้อง Mock ตัวแปร "repo" ให้ชื่อตรงกับใน Controller เป๊ะๆ

    @InjectMocks
    private MenuController menuController;

    @Test
    void TC_I01_DisplayMenuDetail_Success() {
        Menu mockMenu = new Menu();
        mockMenu.setId(5); 
        mockMenu.setName("ผัดกะเพราหมูกรอบ");
        mockMenu.setPrice(60.0);

        // 3. เปลี่ยนจาก menuService เป็น repo และใช้ Optional ตามธรรมชาติของ Spring Data JPA
        when(repo.findById(5L)).thenReturn(Optional.of(mockMenu));

        Menu result = menuController.getMenuById(5L); // เรียกผ่าน Controller จริงๆ
        
        assertNotNull(result);
        assertEquals("ผัดกะเพราหมูกรอบ", result.getName());
    }

    @Test
    void TC_I02_DisplayMenuDetail_Error500() {
        // จำลองว่า Repo พัง
        when(repo.findById(99L)).thenThrow(new RuntimeException("Internal Server Error"));

        assertThrows(RuntimeException.class, () -> {
            menuController.getMenuById(99L);
        });
    }
    
    @Test
    void TC_I07_GetMenuDetail_NullId_ShouldReturnNull() {
        Menu result = menuController.getMenuById(null);
        assertNull(result);
    }
}