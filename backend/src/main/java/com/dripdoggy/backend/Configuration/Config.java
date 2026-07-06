package com.dripdoggy.backend.Configuration;

import jakarta.servlet.MultipartConfigElement;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Config {

    @Bean
    public MultipartConfigElement multipartConfigElement() {
        // location = null (use default temporary directory)
        // maxFileSize = 100MB (100 * 1024 * 1024 bytes)
        // maxRequestSize = 200MB (200 * 1024 * 1024 bytes)
        // fileSizeThreshold = 0 (write to disk immediately)
        return new MultipartConfigElement(null, 100 * 1024 * 1024L, 200 * 1024 * 1024L, 0);
    }
}
