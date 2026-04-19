package com.bowen.blog.tag.controller;

import com.bowen.blog.common.GlobalExceptionHandler;
import com.bowen.blog.tag.entity.Tag;
import com.bowen.blog.tag.service.TagService;
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

class AdminTagControllerTest {

    @Test
    void listEndpointReturnsTags() throws Exception {
        TagService tagService = mock(TagService.class);
        Tag tag = new Tag();
        tag.setId(1L);
        tag.setName("Java");
        when(tagService.listTags()).thenReturn(List.of(tag));

        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new AdminTagController(tagService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        mockMvc.perform(get("/api/admin/tags"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].name").value("Java"));
    }

    @Test
    void createEndpointReturnsSavedTag() throws Exception {
        TagService tagService = mock(TagService.class);
        Tag tag = new Tag();
        tag.setId(1L);
        tag.setName("Java");
        when(tagService.createTag(any(Tag.class))).thenReturn(tag);

        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new AdminTagController(tagService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        mockMvc.perform(post("/api/admin/tags")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Java"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.name").value("Java"));
    }

    @Test
    void updateEndpointReturnsUpdatedTag() throws Exception {
        TagService tagService = mock(TagService.class);
        Tag tag = new Tag();
        tag.setId(1L);
        tag.setName("Spring");
        when(tagService.updateTag(eq(1L), any(Tag.class))).thenReturn(tag);

        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new AdminTagController(tagService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        mockMvc.perform(put("/api/admin/tags/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Spring"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Spring"));
    }

    @Test
    void deleteEndpointReturnsSuccessResponse() throws Exception {
        TagService tagService = mock(TagService.class);
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new AdminTagController(tagService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        mockMvc.perform(delete("/api/admin/tags/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Deleted successfully"));
    }
}
