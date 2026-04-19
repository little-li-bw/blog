package com.bowen.blog.site.controller;

import com.bowen.blog.common.GlobalExceptionHandler;
import com.bowen.blog.site.entity.SiteConfig;
import com.bowen.blog.site.service.SiteConfigService;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AdminSiteConfigControllerTest {

    @Test
    void getEndpointReturnsSiteConfig() throws Exception {
        SiteConfigService siteConfigService = mock(SiteConfigService.class);
        when(siteConfigService.getSiteConfig()).thenReturn(buildConfig());

        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new AdminSiteConfigController(siteConfigService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        mockMvc.perform(get("/api/admin/site-config"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.siteName").value("Bowen Blog"));
    }

    @Test
    void putEndpointReturnsSavedSiteConfig() throws Exception {
        SiteConfigService siteConfigService = mock(SiteConfigService.class);
        SiteConfig config = buildConfig();
        config.setHeroTitle("Updated Hero");
        when(siteConfigService.saveSiteConfig(any(SiteConfig.class))).thenReturn(config);

        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new AdminSiteConfigController(siteConfigService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        mockMvc.perform(put("/api/admin/site-config")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "siteName": "Bowen Blog",
                                  "heroTitle": "Updated Hero",
                                  "heroSubtitle": "Programming notes and technical practice",
                                  "aboutMe": "A pragmatic Java backend developer.",
                                  "skillsBackend": "Java, Spring Boot",
                                  "skillsFrontend": "React",
                                  "skillsDatabase": "MySQL",
                                  "skillsTools": "Docker, Nginx",
                                  "email": "bowen@example.com",
                                  "githubUrl": "https://github.com/bowen",
                                  "resumeUrl": "https://example.com/resume.pdf"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.heroTitle").value("Updated Hero"));
    }

    private SiteConfig buildConfig() {
        SiteConfig config = new SiteConfig();
        config.setSiteName("Bowen Blog");
        config.setHeroTitle("Java Backend Developer");
        config.setHeroSubtitle("Programming notes and technical practice");
        config.setAboutMe("A pragmatic Java backend developer.");
        config.setSkillsBackend("Java, Spring Boot");
        config.setSkillsFrontend("React");
        config.setSkillsDatabase("MySQL");
        config.setSkillsTools("Docker, Nginx");
        config.setEmail("bowen@example.com");
        config.setGithubUrl("https://github.com/bowen");
        config.setResumeUrl("https://example.com/resume.pdf");
        return config;
    }
}
