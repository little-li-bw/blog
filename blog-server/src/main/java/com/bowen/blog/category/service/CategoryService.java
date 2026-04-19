package com.bowen.blog.category.service;

import com.bowen.blog.category.entity.Category;
import com.bowen.blog.category.mapper.CategoryMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class CategoryService {

    private final CategoryMapper categoryMapper;

    public CategoryService(CategoryMapper categoryMapper) {
        this.categoryMapper = categoryMapper;
    }

    public Category createCategory(Category request) {
        validateName(request);
        ensureCategoryNameAvailable(request.getName(), null);

        Category category = new Category();
        category.setName(request.getName().trim());
        category.setSort(normalizeSort(request.getSort()));
        categoryMapper.insert(category);
        return category;
    }

    public List<Category> listCategories() {
        return categoryMapper.findAllOrderBySortAscIdAsc();
    }

    public Category updateCategory(Long id, Category request) {
        validateName(request);

        Category existing = categoryMapper.findById(id);
        if (existing == null) {
            throw new NoSuchElementException("Category not found");
        }

        ensureCategoryNameAvailable(request.getName(), id);
        existing.setName(request.getName().trim());
        existing.setSort(normalizeSort(request.getSort()));
        categoryMapper.updateById(existing);
        return existing;
    }

    public void deleteCategory(Long id) {
        Category existing = categoryMapper.findById(id);
        if (existing == null) {
            throw new NoSuchElementException("Category not found");
        }

        categoryMapper.deleteById(id);
    }

    private void validateName(Category request) {
        if (request == null || request.getName() == null || request.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Category name must not be blank");
        }
    }

    private void ensureCategoryNameAvailable(String name, Long currentCategoryId) {
        Category existing = categoryMapper.findByName(name.trim());
        if (existing != null && !existing.getId().equals(currentCategoryId)) {
            throw new IllegalArgumentException("Category name already exists");
        }
    }

    private int normalizeSort(Integer sort) {
        return sort == null ? 0 : sort;
    }
}
