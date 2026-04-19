package com.bowen.blog.stats.service;

import com.bowen.blog.post.entity.Post;
import com.bowen.blog.post.mapper.PostMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.NoSuchElementException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("阅读量服务单元测试")
class PostViewServiceTest {

    @Mock
    private PostMapper postMapper;

    @InjectMocks
    private PostViewService postViewService;

    @Test
    @DisplayName("文章阅读量自增成功")
    void incrementViewCountSuccess() {
        Post post = new Post();
        post.setId(1L);
        post.setViewCount(12L);
        when(postMapper.findPublishedById(1L)).thenReturn(post);

        long result = postViewService.incrementViewCount(1L);

        assertThat(result).isEqualTo(13L);
        assertThat(post.getViewCount()).isEqualTo(13L);
        verify(postMapper).updateById(post);
    }

    @Test
    @DisplayName("文章不存在时阅读量自增失败")
    void incrementViewCountWhenPostMissingThrowsException() {
        when(postMapper.findPublishedById(99L)).thenReturn(null);

        assertThatThrownBy(() -> postViewService.incrementViewCount(99L))
                .isInstanceOf(NoSuchElementException.class)
                .hasMessage("Post not found");
    }
}
