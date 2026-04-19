package com.bowen.blog.upload.service;

import com.bowen.blog.upload.entity.UploadFile;
import com.bowen.blog.upload.mapper.UploadFileMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class UploadService {

    private final UploadFileMapper uploadFileMapper;
    private final String storagePath;
    private final String urlPrefix;

    public UploadService(UploadFileMapper uploadFileMapper,
                         @Value("${blog.upload.storage-path:uploads}") String storagePath,
                         @Value("${blog.upload.url-prefix:/uploads}") String urlPrefix) {
        this.uploadFileMapper = uploadFileMapper;
        this.storagePath = storagePath;
        this.urlPrefix = normalizeUrlPrefix(urlPrefix);
    }

    public UploadFile saveFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Upload file must not be empty");
        }

        String originalFilename = file.getOriginalFilename();
        String fileName = isBlank(originalFilename) ? "file" : Path.of(originalFilename).getFileName().toString();
        String storedFileName = UUID.randomUUID() + extractExtension(fileName);
        Path uploadDir = Path.of(storagePath).toAbsolutePath().normalize();
        Path targetFile = uploadDir.resolve(storedFileName);

        try {
            Files.createDirectories(uploadDir);
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetFile, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException ex) {
            throw new IllegalStateException("Failed to save upload file", ex);
        }

        UploadFile uploadFile = new UploadFile();
        uploadFile.setFileName(fileName);
        uploadFile.setFilePath(targetFile.toString());
        uploadFile.setFileUrl(urlPrefix + "/" + storedFileName);
        uploadFileMapper.insert(uploadFile);
        return uploadFile;
    }

    private String extractExtension(String fileName) {
        int index = fileName.lastIndexOf('.');
        return index >= 0 ? fileName.substring(index) : "";
    }

    private String normalizeUrlPrefix(String prefix) {
        if (isBlank(prefix)) {
            return "/uploads";
        }
        return prefix.endsWith("/") ? prefix.substring(0, prefix.length() - 1) : prefix;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
