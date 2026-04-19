package com.bowen.blog.site.controller;

import com.bowen.blog.common.ApiResponse;
import com.bowen.blog.site.entity.SiteConfig;
import com.bowen.blog.site.service.SiteConfigService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/site-config")
public class PublicSiteConfigController {

    private final SiteConfigService siteConfigService;

    public PublicSiteConfigController(SiteConfigService siteConfigService) {
        this.siteConfigService = siteConfigService;
    }

    @GetMapping
    public ApiResponse<SiteConfig> get() {
        return ApiResponse.success(siteConfigService.getSiteConfig());
    }
}
