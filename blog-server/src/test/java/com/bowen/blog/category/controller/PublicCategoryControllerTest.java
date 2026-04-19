package com.bowen.blog.category.controller;

import com.bowen.blog.category.entity.Category;
import com.bowen.blog.category.service.CategoryService;
import com.bowen.blog.common.GlobalExceptionHandler;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class PublicCategoryControllerTest {

    @Test
    void listEndpointReturnsPublicCategories() throws Exception {
        CategoryService categoryService = mock(CategoryService.class);
        Category category = new Category();
        category.setId(1L);
        category.setName("Java");
        category.setSort(10);
        when(categoryService.listCategories()).thenReturn(List.of(category));

        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new PublicCategoryController(categoryService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        mockMvc.perform(get("/api/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].name").value("Java"));
    }
}
