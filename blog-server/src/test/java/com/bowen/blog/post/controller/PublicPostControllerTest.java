package com.bowen.blog.post.controller;

import com.bowen.blog.common.GlobalExceptionHandler;
import com.bowen.blog.post.service.PostService;
import com.bowen.blog.post.vo.PostDetailVO;
import com.bowen.blog.post.vo.PostListItemVO;
import com.bowen.blog.stats.service.PostViewService;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class PublicPostControllerTest {

    @Test
    void listEndpointReturnsPublishedPosts() throws Exception {
        PostService postService = mock(PostService.class);
        PostViewService postViewService = mock(PostViewService.class);
        when(postService.listPublishedPosts(null, null, 1, 10)).thenReturn(List.of(buildListItem()));

        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new PublicPostController(postService, postViewService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        mockMvc.perform(get("/api/posts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].title").value("My First Post"))
                .andExpect(jsonPath("$.data[0].categoryName").value("Java"));
    }

    @Test
    void detailEndpointReturnsPostDetail() throws Exception {
        PostService postService = mock(PostService.class);
        PostViewService postViewService = mock(PostViewService.class);
        when(postService.getPublishedPostDetail(1L)).thenReturn(buildDetail());

        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new PublicPostController(postService, postViewService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        mockMvc.perform(get("/api/posts/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.title").value("My First Post"))
                .andExpect(jsonPath("$.data.contentHtml").value("<h1>Title</h1>"));
    }

    @Test
    void detailEndpointReturnsNotFound() throws Exception {
        PostService postService = mock(PostService.class);
        PostViewService postViewService = mock(PostViewService.class);
        when(postService.getPublishedPostDetail(eq(99L))).thenThrow(new NoSuchElementException("Post not found"));

        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new PublicPostController(postService, postViewService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        mockMvc.perform(get("/api/posts/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Post not found"));
    }

    @Test
    void incrementViewsEndpointReturnsCurrentViewCount() throws Exception {
        PostService postService = mock(PostService.class);
        PostViewService postViewService = mock(PostViewService.class);
        when(postViewService.incrementViewCount(1L)).thenReturn(13L);

        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new PublicPostController(postService, postViewService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        mockMvc.perform(post("/api/posts/1/views"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").value(13L));
    }

    private PostListItemVO buildListItem() {
        PostListItemVO item = new PostListItemVO();
        item.setId(1L);
        item.setTitle("My First Post");
        item.setSummary("Intro summary");
        item.setStatus("PUBLISHED");
        item.setCategoryName("Java");
        item.setTags(List.of("Java", "Spring"));
        item.setPublishTime(LocalDateTime.of(2026, 4, 19, 12, 0));
        item.setViewCount(12L);
        return item;
    }

    private PostDetailVO buildDetail() {
        PostDetailVO detail = new PostDetailVO();
        detail.setId(1L);
        detail.setTitle("My First Post");
        detail.setSummary("Intro summary");
        detail.setStatus("PUBLISHED");
        detail.setContentHtml("<h1>Title</h1>");
        detail.setCategoryName("Java");
        detail.setTags(List.of("Java", "Spring"));
        return detail;
    }
}
