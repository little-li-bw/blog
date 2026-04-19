package com.bowen.blog.site.controller;

import com.bowen.blog.common.ApiResponse;
import com.bowen.blog.site.entity.SiteConfig;
import com.bowen.blog.site.service.SiteConfigService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/site-config")
public class AdminSiteConfigController {

    private final SiteConfigService siteConfigService;

    public AdminSiteConfigController(SiteConfigService siteConfigService) {
        this.siteConfigService = siteConfigService;
    }

    @GetMapping
    public ApiResponse<SiteConfig> get() {
        return ApiResponse.success(siteConfigService.getSiteConfig());
    }

    @PutMapping
    public ApiResponse<SiteConfig> update(@RequestBody SiteConfig request) {
        return ApiResponse.success(siteConfigService.saveSiteConfig(request));
    }
}
