package com.bowen.blog.upload.controller;

import com.bowen.blog.common.GlobalExceptionHandler;
import com.bowen.blog.upload.entity.UploadFile;
import com.bowen.blog.upload.service.UploadService;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class UploadControllerTest {

    @Test
    void uploadEndpointReturnsSavedFile() throws Exception {
        UploadService uploadService = mock(UploadService.class);
        UploadFile uploadFile = new UploadFile();
        uploadFile.setId(1L);
        uploadFile.setFileName("hello.txt");
        uploadFile.setFilePath("D:/java/blog/uploads/abc.txt");
        uploadFile.setFileUrl("/uploads/abc.txt");
        when(uploadService.saveFile(any())).thenReturn(uploadFile);

        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new UploadController(uploadService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        mockMvc.perform(multipart("/api/admin/upload")
                        .file(new MockMultipartFile("file", "hello.txt", "text/plain", "hello".getBytes())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.fileUrl").value("/uploads/abc.txt"));
    }
}
