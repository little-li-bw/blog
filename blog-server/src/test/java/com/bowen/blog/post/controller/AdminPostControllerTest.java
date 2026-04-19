package com.bowen.blog.post.controller;

import com.bowen.blog.common.GlobalExceptionHandler;
import com.bowen.blog.post.dto.AdminPostSaveRequest;
import com.bowen.blog.post.service.PostService;
import com.bowen.blog.post.vo.PostDetailVO;
import com.bowen.blog.post.vo.PostListItemVO;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AdminPostControllerTest {

    @Test
    void listEndpointReturnsPosts() throws Exception {
        PostService postService = mock(PostService.class);
        when(postService.listAdminPosts()).thenReturn(List.of(buildListItem()));

        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new AdminPostController(postService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        mockMvc.perform(get("/api/admin/posts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].title").value("My First Post"));
    }

    @Test
    void createEndpointReturnsSavedPost() throws Exception {
        PostService postService = mock(PostService.class);
        when(postService.createPost(any(AdminPostSaveRequest.class))).thenReturn(buildDetail());

        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new AdminPostController(postService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        mockMvc.perform(post("/api/admin/posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "My First Post",
                                  "summary": "Intro summary",
                                  "contentMd": "# Title",
                                  "categoryId": 1,
                                  "tagIds": [1, 2]
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.title").value("My First Post"));
    }

    @Test
    void statusEndpointReturnsUpdatedPost() throws Exception {
        PostService postService = mock(PostService.class);
        when(postService.updateStatus(eq(1L), eq("PUBLISHED"))).thenReturn(buildDetail());

        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new AdminPostController(postService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        mockMvc.perform(put("/api/admin/posts/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "status": "PUBLISHED"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("PUBLISHED"));
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
