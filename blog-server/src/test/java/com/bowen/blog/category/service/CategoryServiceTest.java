package com.bowen.blog.category.service;

import com.bowen.blog.category.entity.Category;
import com.bowen.blog.category.mapper.CategoryMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.NoSuchElementException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("分类服务单元测试")
class CategoryServiceTest {

    @Mock
    private CategoryMapper categoryMapper;

    @InjectMocks
    private CategoryService categoryService;

    @Nested
    @DisplayName("创建分类")
    class CreateCategoryTests {

        @Test
        @DisplayName("创建分类 - 成功")
        void testCreateCategory_Success() {
            Category request = new Category();
            request.setName("Java");
            request.setSort(10);

            when(categoryMapper.findByName("Java")).thenReturn(null);
            doAnswer(invocation -> {
                Category category = invocation.getArgument(0);
                category.setId(1L);
                return 1;
            }).when(categoryMapper).insert(any(Category.class));

            Category result = categoryService.createCategory(request);

            assertThat(result.getId()).isEqualTo(1L);
            assertThat(result.getName()).isEqualTo("Java");
            assertThat(result.getSort()).isEqualTo(10);
        }

        @Test
        @DisplayName("创建分类 - 名称为空时抛出异常")
        void testCreateCategory_BlankName_ThrowException() {
            Category request = new Category();
            request.setName("  ");

            assertThatThrownBy(() -> categoryService.createCategory(request))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Category name must not be blank");

            verify(categoryMapper, never()).insert(any(Category.class));
        }

        @Test
        @DisplayName("创建分类 - 请求为空时抛出异常")
        void testCreateCategory_NullRequest_ThrowException() {
            assertThatThrownBy(() -> categoryService.createCategory(null))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Category name must not be blank");

            verify(categoryMapper, never()).insert(any(Category.class));
        }

        @Test
        @DisplayName("创建分类 - 名称为null时抛出异常")
        void testCreateCategory_NullName_ThrowException() {
            Category request = new Category();
            request.setName(null);

            assertThatThrownBy(() -> categoryService.createCategory(request))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Category name must not be blank");

            verify(categoryMapper, never()).insert(any(Category.class));
        }

        @Test
        @DisplayName("创建分类 - 名称重复时抛出异常")
        void testCreateCategory_DuplicateName_ThrowException() {
            Category request = new Category();
            request.setName("Java");

            Category existing = new Category();
            existing.setId(2L);
            existing.setName("Java");

            when(categoryMapper.findByName("Java")).thenReturn(existing);

            assertThatThrownBy(() -> categoryService.createCategory(request))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Category name already exists");

            verify(categoryMapper, never()).insert(any(Category.class));
        }
    }

    @Test
    @DisplayName("查询分类列表 - 返回排序结果")
    void testListCategories_Success() {
        Category first = new Category();
        first.setId(1L);
        first.setName("Java");
        first.setSort(10);

        Category second = new Category();
        second.setId(2L);
        second.setName("Spring");
        second.setSort(20);

        when(categoryMapper.findAllOrderBySortAscIdAsc()).thenReturn(List.of(first, second));

        List<Category> result = categoryService.listCategories();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getName()).isEqualTo("Java");
        assertThat(result.get(1).getName()).isEqualTo("Spring");
    }

    @Test
    @DisplayName("更新分类 - 成功")
    void testUpdateCategory_Success() {
        Category existing = new Category();
        existing.setId(1L);
        existing.setName("Java");
        existing.setSort(10);

        Category request = new Category();
        request.setName("Spring Boot");
        request.setSort(20);

        when(categoryMapper.findById(1L)).thenReturn(existing);
        when(categoryMapper.findByName("Spring Boot")).thenReturn(null);
        when(categoryMapper.updateById(any(Category.class))).thenReturn(1);

        Category result = categoryService.updateCategory(1L, request);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Spring Boot");
        assertThat(result.getSort()).isEqualTo(20);
    }

    @Test
    @DisplayName("更新分类 - 同ID同名时允许更新且默认排序为0")
    void testUpdateCategory_SameNameAndNullSort_Success() {
        Category existing = new Category();
        existing.setId(1L);
        existing.setName("Java");
        existing.setSort(10);

        Category duplicate = new Category();
        duplicate.setId(1L);
        duplicate.setName("Java");
        duplicate.setSort(10);

        Category request = new Category();
        request.setName("Java");
        request.setSort(null);

        when(categoryMapper.findById(1L)).thenReturn(existing);
        when(categoryMapper.findByName("Java")).thenReturn(duplicate);
        when(categoryMapper.updateById(any(Category.class))).thenReturn(1);

        Category result = categoryService.updateCategory(1L, request);

        assertThat(result.getName()).isEqualTo("Java");
        assertThat(result.getSort()).isEqualTo(0);
    }

    @Test
    @DisplayName("更新分类 - 不存在时抛出异常")
    void testUpdateCategory_NotFound_ThrowException() {
        Category request = new Category();
        request.setName("Spring");
        request.setSort(20);

        when(categoryMapper.findById(1L)).thenReturn(null);

        assertThatThrownBy(() -> categoryService.updateCategory(1L, request))
                .isInstanceOf(NoSuchElementException.class)
                .hasMessage("Category not found");

        verify(categoryMapper, never()).updateById(any(Category.class));
    }

    @Test
    @DisplayName("删除分类 - 成功")
    void testDeleteCategory_Success() {
        Category existing = new Category();
        existing.setId(1L);
        existing.setName("Java");

        when(categoryMapper.findById(1L)).thenReturn(existing);

        categoryService.deleteCategory(1L);

        verify(categoryMapper).deleteById(1L);
    }

    @Test
    @DisplayName("删除分类 - 不存在时抛出异常")
    void testDeleteCategory_NotFound_ThrowException() {
        when(categoryMapper.findById(99L)).thenReturn(null);

        assertThatThrownBy(() -> categoryService.deleteCategory(99L))
                .isInstanceOf(NoSuchElementException.class)
                .hasMessage("Category not found");

        verify(categoryMapper, never()).deleteById(99L);
    }
}
