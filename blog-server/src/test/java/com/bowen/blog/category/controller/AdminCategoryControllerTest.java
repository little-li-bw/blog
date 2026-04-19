package com.bowen.blog.category.controller;

import com.bowen.blog.category.entity.Category;
import com.bowen.blog.category.service.CategoryService;
import com.bowen.blog.common.GlobalExceptionHandler;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AdminCategoryControllerTest {

    @Test
    void listEndpointReturnsCategories() throws Exception {
        CategoryService categoryService = mock(CategoryService.class);
        Category category = new Category();
        category.setId(1L);
        category.setName("Java");
        category.setSort(10);
        when(categoryService.listCategories()).thenReturn(List.of(category));

        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new AdminCategoryController(categoryService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        mockMvc.perform(get("/api/admin/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].name").value("Java"))
                .andExpect(jsonPath("$.data[0].sort").value(10));
    }

    @Test
    void createEndpointReturnsSavedCategory() throws Exception {
        CategoryService categoryService = mock(CategoryService.class);
        Category category = new Category();
        category.setId(1L);
        category.setName("Java");
        category.setSort(10);
        when(categoryService.createCategory(any(Category.class))).thenReturn(category);

        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new AdminCategoryController(categoryService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        mockMvc.perform(post("/api/admin/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Java",
                                  "sort": 10
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.name").value("Java"));
    }

    @Test
    void updateEndpointReturnsUpdatedCategory() throws Exception {
        CategoryService categoryService = mock(CategoryService.class);
        Category category = new Category();
        category.setId(1L);
        category.setName("Spring");
        category.setSort(20);
        when(categoryService.updateCategory(eq(1L), any(Category.class))).thenReturn(category);

        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new AdminCategoryController(categoryService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        mockMvc.perform(put("/api/admin/categories/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Spring",
                                  "sort": 20
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Spring"))
                .andExpect(jsonPath("$.data.sort").value(20));
    }

    @Test
    void deleteEndpointReturnsSuccessResponse() throws Exception {
        CategoryService categoryService = mock(CategoryService.class);
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new AdminCategoryController(categoryService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        mockMvc.perform(delete("/api/admin/categories/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Deleted successfully"));
    }
}
