package com.bowen.blog.tag.controller;

import com.bowen.blog.common.GlobalExceptionHandler;
import com.bowen.blog.tag.entity.Tag;
import com.bowen.blog.tag.service.TagService;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class PublicTagControllerTest {

    @Test
    void listEndpointReturnsPublicTags() throws Exception {
        TagService tagService = mock(TagService.class);
        Tag tag = new Tag();
        tag.setId(1L);
        tag.setName("Java");
        when(tagService.listTags()).thenReturn(List.of(tag));

        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new PublicTagController(tagService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        mockMvc.perform(get("/api/tags"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].name").value("Java"));
    }
}
