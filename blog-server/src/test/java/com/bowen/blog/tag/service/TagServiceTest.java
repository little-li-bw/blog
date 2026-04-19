package com.bowen.blog.tag.service;

import com.bowen.blog.tag.entity.Tag;
import com.bowen.blog.tag.mapper.TagMapper;
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
@DisplayName("标签服务单元测试")
class TagServiceTest {

    @Mock
    private TagMapper tagMapper;

    @InjectMocks
    private TagService tagService;

    @Nested
    @DisplayName("创建标签")
    class CreateTagTests {

        @Test
        @DisplayName("创建标签 - 成功")
        void testCreateTag_Success() {
            Tag request = new Tag();
            request.setName("Spring Boot");

            when(tagMapper.findByName("Spring Boot")).thenReturn(null);
            doAnswer(invocation -> {
                Tag tag = invocation.getArgument(0);
                tag.setId(1L);
                return 1;
            }).when(tagMapper).insert(any(Tag.class));

            Tag result = tagService.createTag(request);

            assertThat(result.getId()).isEqualTo(1L);
            assertThat(result.getName()).isEqualTo("Spring Boot");
        }

        @Test
        @DisplayName("创建标签 - 名称为空时抛出异常")
        void testCreateTag_BlankName_ThrowException() {
            Tag request = new Tag();
            request.setName("  ");

            assertThatThrownBy(() -> tagService.createTag(request))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Tag name must not be blank");

            verify(tagMapper, never()).insert(any(Tag.class));
        }

        @Test
        @DisplayName("创建标签 - 请求为空时抛出异常")
        void testCreateTag_NullRequest_ThrowException() {
            assertThatThrownBy(() -> tagService.createTag(null))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Tag name must not be blank");

            verify(tagMapper, never()).insert(any(Tag.class));
        }

        @Test
        @DisplayName("创建标签 - 名称重复时抛出异常")
        void testCreateTag_DuplicateName_ThrowException() {
            Tag request = new Tag();
            request.setName("Java");

            Tag existing = new Tag();
            existing.setId(2L);
            existing.setName("Java");

            when(tagMapper.findByName("Java")).thenReturn(existing);

            assertThatThrownBy(() -> tagService.createTag(request))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Tag name already exists");

            verify(tagMapper, never()).insert(any(Tag.class));
        }
    }

    @Test
    @DisplayName("查询标签列表 - 返回排序结果")
    void testListTags_Success() {
        Tag first = new Tag();
        first.setId(1L);
        first.setName("Java");

        Tag second = new Tag();
        second.setId(2L);
        second.setName("Spring");

        when(tagMapper.findAllOrderByNameAscIdAsc()).thenReturn(List.of(first, second));

        List<Tag> result = tagService.listTags();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getName()).isEqualTo("Java");
        assertThat(result.get(1).getName()).isEqualTo("Spring");
    }

    @Test
    @DisplayName("更新标签 - 成功")
    void testUpdateTag_Success() {
        Tag existing = new Tag();
        existing.setId(1L);
        existing.setName("Java");

        Tag request = new Tag();
        request.setName("Spring Boot");

        when(tagMapper.findById(1L)).thenReturn(existing);
        when(tagMapper.findByName("Spring Boot")).thenReturn(null);
        when(tagMapper.updateById(any(Tag.class))).thenReturn(1);

        Tag result = tagService.updateTag(1L, request);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Spring Boot");
    }

    @Test
    @DisplayName("更新标签 - 同 ID 同名时允许更新")
    void testUpdateTag_SameName_Success() {
        Tag existing = new Tag();
        existing.setId(1L);
        existing.setName("Java");

        Tag duplicate = new Tag();
        duplicate.setId(1L);
        duplicate.setName("Java");

        Tag request = new Tag();
        request.setName("Java");

        when(tagMapper.findById(1L)).thenReturn(existing);
        when(tagMapper.findByName("Java")).thenReturn(duplicate);
        when(tagMapper.updateById(any(Tag.class))).thenReturn(1);

        Tag result = tagService.updateTag(1L, request);

        assertThat(result.getName()).isEqualTo("Java");
    }

    @Test
    @DisplayName("更新标签 - 不存在时抛出异常")
    void testUpdateTag_NotFound_ThrowException() {
        Tag request = new Tag();
        request.setName("Redis");

        when(tagMapper.findById(1L)).thenReturn(null);

        assertThatThrownBy(() -> tagService.updateTag(1L, request))
                .isInstanceOf(NoSuchElementException.class)
                .hasMessage("Tag not found");

        verify(tagMapper, never()).updateById(any(Tag.class));
    }

    @Test
    @DisplayName("删除标签 - 成功")
    void testDeleteTag_Success() {
        Tag existing = new Tag();
        existing.setId(1L);
        existing.setName("Java");

        when(tagMapper.findById(1L)).thenReturn(existing);

        tagService.deleteTag(1L);

        verify(tagMapper).deleteById(1L);
    }

    @Test
    @DisplayName("删除标签 - 不存在时抛出异常")
    void testDeleteTag_NotFound_ThrowException() {
        when(tagMapper.findById(99L)).thenReturn(null);

        assertThatThrownBy(() -> tagService.deleteTag(99L))
                .isInstanceOf(NoSuchElementException.class)
                .hasMessage("Tag not found");

        verify(tagMapper, never()).deleteById(99L);
    }
}
