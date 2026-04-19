package com.bowen.blog.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;

@Configuration
public class UploadResourceConfig implements WebMvcConfigurer {

    private final String storagePath;
    private final String urlPrefix;

    public UploadResourceConfig(@Value("${blog.upload.storage-path:uploads}") String storagePath,
                                @Value("${blog.upload.url-prefix:/uploads}") String urlPrefix) {
        this.storagePath = storagePath;
        this.urlPrefix = urlPrefix;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String normalizedUrlPrefix = urlPrefix.endsWith("/") ? urlPrefix : urlPrefix + "/";
        String location = Path.of(storagePath).toAbsolutePath().normalize().toUri().toString();
        registry.addResourceHandler(normalizedUrlPrefix + "**")
                .addResourceLocations(location);
    }
}
