package com.bowen.blog.upload.service;

import com.bowen.blog.upload.entity.UploadFile;
import com.bowen.blog.upload.mapper.UploadFileMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@DisplayName("上传服务单元测试")
class UploadServiceTest {

    @TempDir
    Path tempDir;

    @Test
    @DisplayName("保存文件成功")
    void saveFileSuccess() throws Exception {
        UploadFileMapper uploadFileMapper = mock(UploadFileMapper.class);
        doAnswer(invocation -> {
            UploadFile uploadFile = invocation.getArgument(0);
            uploadFile.setId(1L);
            return 1;
        }).when(uploadFileMapper).insert(any(UploadFile.class));

        UploadService uploadService = new UploadService(uploadFileMapper, tempDir.toString(), "/uploads");
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "hello.txt",
                "text/plain",
                "hello upload".getBytes()
        );

        UploadFile result = uploadService.saveFile(file);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getFileName()).isEqualTo("hello.txt");
        assertThat(result.getFileUrl()).startsWith("/uploads/");
        assertThat(Files.readString(Path.of(result.getFilePath()))).isEqualTo("hello upload");
    }

    @Test
    @DisplayName("空文件上传失败")
    void saveFileWhenEmptyThrowsException() {
        UploadFileMapper uploadFileMapper = mock(UploadFileMapper.class);
        UploadService uploadService = new UploadService(uploadFileMapper, tempDir.toString(), "/uploads");
        MockMultipartFile file = new MockMultipartFile("file", "empty.txt", "text/plain", new byte[0]);

        assertThatThrownBy(() -> uploadService.saveFile(file))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Upload file must not be empty");

        verify(uploadFileMapper, never()).insert(any(UploadFile.class));
    }
}
