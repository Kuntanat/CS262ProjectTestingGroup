package com.example.demo.service;

import com.example.demo.model.Menu;
import org.springframework.stereotype.Service;

@Service
public interface MenuService {
    Menu getMenuById(Integer id);
}